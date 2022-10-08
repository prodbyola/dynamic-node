import { useEffect } from 'react'
import DynamicNode from 'dynamic-node'
import 'dynamic-node/build/index.css'

import { theme } from "../theme"

export default function Demo(){
  const pryColor = theme.palette.primary

  useEffect(() => {
    const dynode = new DynamicNode({
      element: 'dynode'
    })

    dynode.mount()

  }, [])

  return (
    <div className='demo-content'>
      <div className='demo-section' style={{
        backgroundColor: pryColor.dark
      }}>
        <div id="dynode-parent" style={{
          backgroundColor: pryColor.main
        }}>
          <div id='dynode'></div>
        </div>
      </div>
    </div>
  )
}