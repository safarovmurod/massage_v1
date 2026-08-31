import { useState } from 'react'
import { TextField, InputAdornment, IconButton, Tooltip } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'

const baseSx = {
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
    '&:hover fieldset': { borderColor: 'rgba(212,168,87,0.4)' },
    '&.Mui-focused fieldset': { borderColor: '#d4a857' },
  },
  '& .MuiInputLabel-root': { color: '#8a7f76' },
  '& .MuiInputLabel-root.Mui-focused': { color: '#d4a857' },
}

/**
 * Поле пароля с кнопкой "показать / скрыть" (глазок).
 * Полностью заменяет <TextField type="password" />.
 *
 * Пропсы: те же, что у MUI TextField.
 *  showLabel / hideLabel — подписи для подсказки (локализуются снаружи).
 */
export default function PasswordField({
  sx,
  showLabel = 'Показать пароль',
  hideLabel = 'Скрыть пароль',
  ...props
}) {
  const [visible, setVisible] = useState(false)

  return (
    <TextField
      {...props}
      type={visible ? 'text' : 'password'}
      sx={{ ...baseSx, ...sx }}
      InputProps={{
        ...(props.InputProps || {}),
        endAdornment: (
          <InputAdornment position="end">
            <Tooltip title={visible ? hideLabel : showLabel} placement="left">
              <IconButton
                aria-label={visible ? hideLabel : showLabel}
                onClick={() => setVisible(v => !v)}
                onMouseDown={e => e.preventDefault()}
                edge="end"
                tabIndex={-1}
                sx={{
                  color: visible ? '#d4a857' : '#8a7f76',
                  transition: 'color 0.2s ease',
                  '&:hover': { color: '#d4a857', background: 'rgba(212,168,87,0.08)' },
                }}
              >
                {visible ? <VisibilityOff fontSize="small" /> : <Visibility fontSize="small" />}
              </IconButton>
            </Tooltip>
          </InputAdornment>
        ),
      }}
    />
  )
}
