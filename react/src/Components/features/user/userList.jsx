import { useSelector, useDispatch } from "react-redux";
import { useEffect } from 'react';
import { getAllUsers } from "./userSlice";
import {
    Box,
    Typography,
    Card,
    CardContent,
    Divider,
    CircularProgress,
} from "@mui/material";

export default function UserList() {
    const dispatch = useDispatch();
    const users = useSelector((o) => o.user.userList);

    useEffect(() => {
        dispatch(getAllUsers());
    }, []);

    if (!users) {
        return (
            <Box sx={{ textAlign: "center", mt: 5 }}>
                <CircularProgress />
                <Typography>טוען משתמשים...</Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ maxWidth: 800, mx: "auto", mt:0, px: 2 }}>
            <Typography
                variant="h4"
                gutterBottom
                textAlign="center"
                sx={{ color: "#a97342", mb: 2 }}
            >
                רשימת משתמשים
            </Typography>

            {users.length === 0 ? (
                <Typography variant="h6" textAlign="center">
                    לא נמצאו משתמשים
                </Typography>
            ) : (
                users.map((user, index) => (
                    <Card
                        key={index}
                        sx={{
                            mb: 3,
                            boxShadow: 3,
                            borderRadius: 3,
                            px: 2,
                            py: 2,
                            backgroundColor: "#fff",
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{ color: "#5c4532", mb: 1 }}
                        >
                            משתמש #{index + 1}
                        </Typography>

                        <Divider sx={{ mb: 2 }} />

                        <Box sx={{ px: 1 }}>

                            <Typography sx={{ mb: 1 }}>
                                <strong> ת.ז. :</strong> {user.id}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                                <strong>שם:</strong> {user.name || "ללא שם"}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                                <strong>טלפון:</strong> {user.phoneNumber}
                            </Typography>
                            <Typography sx={{ mb: 1 }}>
                                <strong> קוד :</strong> {user.code}
                            </Typography>
                        </Box>
                    </Card>
                ))
            )}
        </Box>
    );
}
