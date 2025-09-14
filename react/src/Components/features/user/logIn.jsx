import { useEffect, useState } from "react"
import { useDispatch, useSelector } from 'react-redux'
import { getAllUsers, updateCurrentUser, updateMnager } from "./userSlice"
import { useNavigate } from 'react-router-dom'
import {
    TextField, Button, Box, Typography, Alert, Paper, Stack
} from '@mui/material'

export default function Login() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [user, setUser] = useState({ name: "", code: "" })
    const [error, setError] = useState("")

    const users = useSelector(state => state.user.userList)

    useEffect(() => {
        dispatch(getAllUsers())
    }, [])

    const save = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value })
    }

    const check = async (e) => {
        e.preventDefault()

        if (!user.name.trim() || !user.code.trim()) {
            setError("יש למלא את כל הפרטים")
            return
        }

        if (user.code === "13032005" && user.name === "naomi") {
            await dispatch(updateMnager(user))
            localStorage.setItem("manager", JSON.stringify(user))
            navigate("/home")
            return
        }

        const foundUser = users?.find(i => i.code === user.code && i.name === user.name)

        if (!foundUser) {
            setError("הפרטים שגויים או שאינך רשום")
        } else {
            await dispatch(updateCurrentUser(foundUser))
            localStorage.setItem("currentUser", JSON.stringify(foundUser))
            navigate("/home")
        }
    }

    return (
        <Box display="flex" justifyContent="center" alignItems="center" height="65vh">
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
                            התחברות למערכת
                        </Typography>

                        {error && <Alert severity="warning" sx={{ fontWeight: 500 }}>{error}</Alert>}

                        <TextField
                            label="שם משתמש"
                            name="name"
                            value={user.name}
                            onChange={save}
                            fullWidth
                            variant="outlined"
                        />

                        <TextField
                            label="סיסמה"
                            name="code"
                            type="password"
                            value={user.code}
                            onChange={save}
                            fullWidth
                            variant="outlined"
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
                            התחבר
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    )
}
