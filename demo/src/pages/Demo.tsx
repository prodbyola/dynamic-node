import { useEffect, useState, ChangeEvent } from 'react'
import DynamicNode, { DynodeOptions, EventValue } from 'dynamic-node'

import 'dynamic-node/build/index.css'

import { FormControlLabel, Switch } from '@mui/material'
import DynodeMeta from '../components/DynodeMeta'

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

  const changeSwitch = (e: ChangeEvent<HTMLInputElement>, key: 'boundByParent') => {
    const checked = e.target.checked
    if(key === 'boundByParent') {
      options.boundByParent = checked
      dynode.boundByParent = checked
    }

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
            <FormControlLabel 
              className='switch'
              control={<Switch 
                checked={options.boundByParent} 
                onChange={ (e) => changeSwitch(e, 'boundByParent') } 
                sx={{
                  '& .MuiSwitch-thumb': {
                    backgroundColor: pryColor.light
                  },
                  '& .MuiSwitch-switchBase': {
                    '&.Mui-checked': {
                      '& + .MuiSwitch-track': {
                        backgroundColor: 'white'
                      }
                    }
                  }
                }} 
              />} 
              label="Bound within parent" 
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