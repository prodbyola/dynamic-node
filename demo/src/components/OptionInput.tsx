import { ChangeEvent } from 'react'
import { FormControlLabel, Switch, TextField, TextFieldProps } from '@mui/material'

import { theme } from "../theme"

export default function OptionInput(props: {
    value: unknown
    label: string
    type?: string
    onChange: (e: ChangeEvent) => void
}){
    const pryColor = theme.palette.primary
    const { value, label, onChange, type } = props


    if(type === 'switch'){
      return (
        <FormControlLabel 
          className='switch'
          control={<Switch 
            checked={value as boolean} 
            onChange={ onChange } 
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
          label={label} 
        />
      )
    } else {
      return (
        <TextField 
          label={label}
          variant="outlined" 
          type={type} 
          value={value}
          onChange={onChange as TextFieldProps['onChange']}
          size="small"
          style={{
            width: 54
          }}
        />
      )
    }
}