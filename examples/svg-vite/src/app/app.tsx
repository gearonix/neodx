import { entries, keys } from '@neodx/std';
import clsx from 'clsx';
import { useState } from 'react';
import { type AnyIconName, Icon, SPRITES_META } from '../shared/ui/icon';

export function App() {
  const [selected, setSelected] = useState<AnyIconName>('logos/twitter');

  return (
    <div className="container mx-auto min-h-screen text-2xl py-8 flex flex-col gap-8">
      <div className="flex flex-col gap-4 text-base">
        <div>
          <Icon name="common/groups" className="text-xs" />
          <Icon name="common/groups" />
          <Icon name="common/groups" className="text-2xl" />
          <Icon name="common/groups" className="text-4xl" />
          <Icon name="common/groups" className="text-6xl" />
        </div>
        <div className="flex gap-4 items-center">
          <Icon name="common/copy" className="text-xl" />
          <Icon name="logos/twitter" />
          <Icon name="logos/linkedin" className="text-4xl" />
          <Icon
            name="common/edit"
            className="bg-pink-100 text-pink-700 p-2 rounded-full border border-pink-700"
          />
        </div>
        <span className="text-sm inline-flex items-center gap-2">
          <Icon name="common/filter" />
          Small description example
          <Icon name="tool/history" />
        </span>
      </div>

      <section className="grid grid-cols-2 grid-flow-row gap-8">
        <h1 className="inline-flex items-center gap-2">
          Playground <Icon name="common/ide-update" />
        </h1>
        <div>
          <h1>Multicolor icon</h1>
          <h3 className="text-lg text-neutral-700">
            Use{' '}
            <small className="bg-gradient-to-r from-cyan-700 to-cyan-800 text-white p-1 rounded-lg">
              --icon-color
            </small>{' '}
            to control second color
          </h3>
        </div>
        <div className="flex flex-col gap-4">
          <div className="inline-flex gap-4 flex-row">
            <div>
              <h3 className="text-green-800 mb-2">OK</h3>
              <Icon
                className="rounded-xl bg-gradient-to-br from-slate-100 to-stone-200 shadow-sm border border-gray-300 p-8 text-8xl text-red-800"
                name={selected}
              />
            </div>
            <div>
              <h3 className="text-red-800 mb-2">Bad</h3>
              <Icon
                className="rounded-xl bg-gradient-to-br from-slate-100 to-stone-200 shadow-sm border border-gray-300 p-8 text-8xl text-red-800"
                name={selected}
              />
            </div>
          </div>
          <select
            className="rounded-lg bg-gradient-to-br from-slate-100 to-stone-200 shadow-sm border border-gray-300 p-2 text-2xl text-red-800"
            value={selected}
            onChange={e => setSelected(e.target.value as AnyIconName)}
          >
            {Object.entries(SPRITES_META).map(([group, { items }]) => (
              <optgroup key={group} label={group}>
                {keys(items).map(name => (
                  <option key={name} value={`${group}/${name}` as AnyIconName}>
                    {name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
        <Icon
          className="rounded-xl bg-zinc-100 border border-gray-300 p-8 text-8xl text-sky-600 [--icon-color:theme(colors.green.800)]"
          name="common/double-color"
        />
      </section>
      <h1>All icons</h1>
      <div className="flex flex-col gap-4">
        {entries(SPRITES_META).map(([group, { items }]) => (
          <section key={group}>
            <h4 className="text-xl text-neutral-700 mb-4">{group}</h4>
            <div className="flex gap-4 flex-wrap text-4xl">
              {keys(items).map(name => (
                <div
                  key={name}
                  role="button"
                  onClick={() => setSelected(`${group}/${name}`)}
                  className={clsx(
                    'bg-neutral-100 border transition-colors border-stone-200 p-4 text-violet-800 rounded-lg',
                    'hover:bg-neutral-200 hover:border-stone-300',
                    'active:bg-neutral-300 active:border-stone-400'
                  )}
                >
                  <Icon
                    name={`${group}/${name}` as AnyIconName}
                    className={clsx(group === 'flags' && 'rounded-full')}
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
