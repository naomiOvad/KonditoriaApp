import React from "react";
import { Box, Typography, Container, Grid } from "@mui/material";
import h from '../../../assets/home/h.png';
import img2 from  '../../../assets/home/img2.jpg';
import img3 from  '../../../assets/home/img3.jpg'; 
import img4 from  '../../../assets/home/aa.jpg'; 
import img5 from  '../../../assets/home/ss.jpg'; 
import img6 from  '../../../assets/home/img6.png'; 
import img7 from  '../../../assets/home/tt.jpg'; 

export default function Home() {
    return (
        <Box>
            {/* תמונה ראשית */}
            <Box
                component="img"
                src={h}
                alt="Biscotti store"
                sx={{
                    width: "100%",
                    maxHeight: "90vh",
                    objectFit: "cover",
                    display: "block",
                }}
            />

            {/* טקסט + גלריה */}
            <Container sx={{ py: 5 }}>
                <Typography variant="h4" textAlign="center" gutterBottom>
                    ?מה תמצאו אצלנו
                </Typography>

                <Grid container spacing={4} justifyContent="center">
                    {[  img2, img3,img4,img5,img7].map((src, index) => (
                        <Grid item xs={12} sm={6} md={3} key={index}>
                            <Box
                                component="img"
                                src={src}
                                alt={`product-${index}`}
                                sx={{
                                    width: "100%",
                                    height: 200,
                                    objectFit: "cover",
                                    borderRadius: 4,
                                    boxShadow: 2,
                                }}
                            />
                        </Grid>
                    ))}
                </Grid>
            </Container>
        </Box>
    );
}
