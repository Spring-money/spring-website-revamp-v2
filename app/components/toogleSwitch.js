import * as React from 'react';
import { styled } from '@mui/material/styles';
import FormGroup from '@mui/material/FormGroup';
import Switch from '@mui/material/Switch';
import Stack from '@mui/material/Stack';


const AntSwitch = styled(Switch)(({ theme }) => ({
    width: 35,
    height: 20,
    padding: 0,
    display: 'flex',
    justifyContent:'center',
    alignItems:'center',
    '&:active': {
        '& .MuiSwitch-thumb': {
            width: 20,
        },
        '& .MuiSwitch-switchBase.Mui-checked': {
            transform: 'translateX(9px)',
        },
    },
    '& .MuiSwitch-switchBase': {
        padding: 2,
        '&.Mui-checked': {
            transform: 'translateX(15px)',
            color: '#fff',
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#108E66' : '#108E66',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        boxShadow: '0 2px 4px 0 rgb(0 35 11 / 20%)',
        width: 16,
        height: 16,
        borderRadius: 60,
        transition: theme.transitions.create(['width'], {
            duration: 200,
        }),
    },
    '& .MuiSwitch-track': {
        borderRadius: 30 / 2,
        opacity: 1,
        backgroundColor:
            theme.palette.mode === 'dark' ? 'rgba(255,255,255,.35)' : 'rgba(0,0,0,.25)',
        boxSizing: 'border-box',
    },
}));

export default function CustomizedSwitches({ checked, onChange }) {
    return (
        <FormGroup>
            <Stack direction="row" spacing={1} alignItems="center">
                
                <AntSwitch checked={checked} onChange={onChange}  inputProps={{ 'aria-label': 'ant design' }} />
                
            </Stack>
        </FormGroup>
    );
}
