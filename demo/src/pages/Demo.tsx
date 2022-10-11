import { useEffect, useState, ChangeEvent } from 'react'
import DynamicNode from 'dynamic-node'
import { DynodeOptions } from 'dynamic-node/build/interface'

import 'dynamic-node/build/index.css'

import { FormControlLabel, Switch } from '@mui/material'

import { theme } from "../theme"

const defaults: DynodeOptions = {
  element: 'dynode',
  boundByParent: true
}

const dynode = new DynamicNode(defaults)

export default function Demo(){
  const pryColor = theme.palette.primary
  const [options, updateOptions] = useState(defaults)

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
  })

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
    </div>
  )
}