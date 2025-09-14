import React, { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { addUser, addUserTOJESON, getAllUsers, updateCurrentUser } from "./userSlice"
import { useNavigate } from 'react-router-dom'
import {
    TextField, Button, Box, Typography, Alert, Paper, Stack
} from '@mui/material'

const SignUp = () => {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState({ name: "", code: "", phoneNumber: "" })
    const [error, setError] = useState("")

    const users = useSelector(s => s.user.userList)

    useEffect(() => {
        dispatch(getAllUsers())
    }, [])

    const save = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const check = async (e) => {
        e.preventDefault()

        if (!user.name.trim() || !user.code.trim() || !user.phoneNumber.trim()) {
            setError("יש למלא את כל הפרטים")
            return
        }

        const existingUser = users?.find(i => i.code === user.code && i.name === user.name)
        if (existingUser) {
            setError("משתמש כבר קיים. נסי להתחבר")
            return
        }

        const { payload } = await dispatch(addUserTOJESON(user))
        dispatch(addUser(payload))
        dispatch(updateCurrentUser(payload))
        navigate("/home")
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
            <Paper elevation={4} sx={{
                padding: 5,
                width: 400,
                borderRadius: 5,
                boxShadow: '0 0 18px rgba(0, 0, 0, 0.15)',
                fontFamily: `'Assistant', sans-serif`,
                backgroundColor: 'white'
            }}>
                <form onSubmit={check}>
                    <Stack spacing={3}>
                        <Typography variant="h5" textAlign="center" fontWeight={600}>
                            הרשמה למערכת
                        </Typography>

                        {error && <Alert severity="warning" sx={{ fontWeight: 500 }}>{error}</Alert>}

                        <TextField
                            label="שם משתמש"
                            name="name"
                            value={user.name}
                            onChange={save}
                            fullWidth
                        />

                        <TextField
                            label="סיסמה"
                            name="code"
                            type="password"
                            value={user.code}
                            onChange={save}
                            fullWidth
                        />

                        <TextField
                            label="מספר טלפון"
                            name="phoneNumber"
                            value={user.phoneNumber}
                            onChange={save}
                            fullWidth
                        />

                        <Button
                            variant="contained"
                            color="primary"
                            type="submit"
                            fullWidth
                            sx={{
                                fontWeight: 600,
                                fontSize: '1rem',
                                borderRadius: '8px'
                            }}
                        >
                            הרשם
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}

export default SignUp
