import type { LoggerMethods } from '@neodx/log';
import { entries, isEmpty, toArray, True, uniq } from '@neodx/std';
import type { AnyNode, DocumentNode, NodeByType, NodeType } from '../core';
import type { GraphNode } from './create-nodes-graph';

export interface CollectNodesParams
  extends Partial<{
    [Type in NodeType]: PredicateInput<GraphNode<NodeByType<Type>>>;
  }> {
  /**
   * When we're done with filtering nodes hierarchy, we can extract the nodes we want to export.
   * Can accept a specific node type, custom function or array of them.
   * @example (node) => node.registry.types.COMPONENT // export all components
   * @example 'COMPONENT' // export all components too
   * @example ['COMPONENT', 'FRAME'] // export all components and frames
   * @default Extracts all `COMPONENT` nodes.
   */
  extract?: NodesExtractor | NodeType | Array<NodeType | NodesExtractor>;
  logger?: LoggerMethods<'debug'>;
}

export interface NodesExtractor {
  (node: GraphNode<AnyNode>): GraphNode<AnyNode> | GraphNode<AnyNode>[];
}

export type PredicateInput<T> = PredicateInputValue<T> | PredicateInputValue<T>[];
export type PredicateInputValue<T> = string | RegExp | PredicateFn<T>;
export type PredicateFn<T> = (node: T) => boolean;

type NodeTypeCondition = [NodeType, PredicateInput<GraphNode<any>> | undefined];

/**
 * Filter and collect all specified nodes from the graph.
 * You can specify multiple conditions for each node type.
 * @default Collects all `COMPONENT` nodes.
 */
export function collectNodes(
  root: GraphNode<DocumentNode>,
  { logger, extract = 'COMPONENT', ...conditions }: CollectNodesParams = {}
) {
  const extractors = toArray(extract).map(extractor =>
    typeof extractor === 'string' ? extractNodeType(extractor) : extractor
  );

  logger?.debug('Collecting nodes...');
  const collected = collectByConditions(root, entries(conditions), logger);

  logger?.debug('Collected %s nodes', collected.length);

  return uniq(collected.flatMap(node => extractors.flatMap(extractor => extractor(node))));
}

export const extractNodeType = (type: NodeType) => (node: GraphNode<AnyNode>) =>
  node.type === type ? node : node.registry.types[type] ?? [];

const collectByConditions = (
  root: GraphNode<AnyNode>,
  conditions: [...NodeTypeCondition[]],
  logger?: LoggerMethods<'debug'>
): GraphNode<AnyNode>[] => {
  if (isEmpty(conditions)) return [root];
  const [[type, predicate], ...nextConditions] = conditions;
  const nodes: GraphNode<AnyNode>[] = root.registry.types[type] ?? [];

  if (!predicate) {
    return isEmpty(nextConditions) ? nodes : collectByConditions(root, nextConditions, logger);
  }
  if (isEmpty(nodes)) return [];
  const collected = nodes.filter(toPredicate(predicate, node => node.source.name));

  logger?.debug('Collected "%s" node types: %s', type, collected.length);
  return isEmpty(nextConditions)
    ? collected
    : collected.flatMap(node => collectByConditions(node, nextConditions, logger));
};

const toPredicate = <T>(
  predicate: PredicateInput<T>,
  getStringValue: (node: T) => string
): PredicateFn<T> => {
  const filters = toArray(predicate).map(filter => {
    if (typeof filter === 'function') return filter;
    if (typeof filter === 'string') return (node: T) => getStringValue(node).includes(filter);
    return (node: T) => filter.test(getStringValue(node));
  });

  if (isEmpty(filters)) return True;
  return (node: T) => filters.some(fn => fn(node));
};
