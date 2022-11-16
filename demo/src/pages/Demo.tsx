import { useEffect, useState, ChangeEvent } from 'react'
// import DynamicNode, { DynodeOptions, EventValue } from 'dynamic-node'
import DynamicNode, { DynodeOptions, EventValue } from 'dynamic-node'

import 'dynamic-node/build/index.css'

import DynodeMeta from '../components/DynodeMeta'
import OptionInput from '../components/OptionInput'

import { theme } from "../theme"

const defaults: DynodeOptions = {
  element: 'dynode',
  boundByParent: true
}

const dynode = new DynamicNode(defaults)

export default function Demo(){
  const pryColor = theme.palette.primary
  const [options, updateOptions] = useState(defaults)
  const [nodeRects, updateRects] = useState<EventValue>({
    pos: dynode.position,
    dm: dynode.dimension,
    rPos: dynode.relativePosition
  })

  dynode.on('move', (e) => updateRects(e as EventValue))
  dynode.on('resize', (e) => updateRects(e as EventValue))

  const changeSwitch = (e: ChangeEvent,  key: keyof DynodeOptions) => {
    const checkable = ['boundByParent', 'cursors', 'allowDrag'].includes(key)

    const target = e.target as HTMLInputElement
    let value: boolean | string = target.value

    if(checkable) value = target.checked
    dynode[key] = value as never

    const newOpt = Object.create(options)
    updateOptions(newOpt)
  }

  useEffect(() => {
    dynode.mount()
    updateRects({
      pos: dynode.position,
      dm: dynode.dimension,
      rPos: dynode.relativePosition
    })
  }, [])

  return (
    <div className='demo-content'>
      <div className='demo-section' style={{
        backgroundColor: pryColor.dark
      }}>
        <div className='toolbar'style={{
            backgroundColor: pryColor.main
          }}>
            <OptionInput 
              value={dynode.boundByParent}
              label="Bound by parent"
              type='switch'
              onChange={(e) => changeSwitch(e, 'boundByParent')} 
            />
            <OptionInput 
              value={dynode.cursors}
              label="Show Cursors"
              type='switch'
              onChange={(e) => changeSwitch(e, 'cursors')} 
            />
            <OptionInput 
              value={dynode.allowDrag}
              label="Allow Drag"
              type='switch'
              onChange={(e) => changeSwitch(e, 'allowDrag')} 
            />
            <OptionInput 
              value={dynode.outputDecimal}
              label="OD"
              type='type'
              onChange={(e) => changeSwitch(e, 'outputDecimal')} 
            />
          </div>
        <div className='showcase'>
          <div id="dynode-parent" style={{
            backgroundColor: pryColor.main
          }}>
            <div id='dynode'></div>
          </div>
        </div>
      </div>
      <div className='demo-sidebar'>
        <DynodeMeta 
          title='Dimensions' 
          left={{
            label: 'Width',
            value: nodeRects.dm.width
          }}
          right={{
            label: 'Height',
            value: nodeRects.dm.height
          }}
        />
        <DynodeMeta 
          title='Position' 
          left={{
            label: 'Top',
            value: nodeRects.pos.top
          }}
          right={{
            label: 'Left',
            value: nodeRects.pos.left
          }}
        />
        <DynodeMeta 
          title='Relative Position' 
          left={{
            label: 'Top',
            value: nodeRects.rPos.top
          }}
          right={{
            label: 'Left',
            value: nodeRects.rPos.left
          }}
        />
      </div>
    </div>
  )
}