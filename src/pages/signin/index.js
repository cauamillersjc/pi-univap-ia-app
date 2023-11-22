import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Face, Key } from '@mui/icons-material';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { ToggleButton, ToggleButtonGroup } from '@mui/material';
import Webcam from 'react-webcam';
import { useNavigate } from 'react-router-dom';

const defaultTheme = createTheme();

export default function SignIn() {
    const [authenticationType, setAuthenticationType] = React.useState('password');
    const [photo, setPhoto] = React.useState("");
    const [error, setError] = React.useState("");

    const webcamRef = React.useRef(null);
    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);

        if (authenticationType === "password") {
            const userCredentials = {
                user: data.get('user'),
                password: data.get('password'),
            };
            fetchLogin(userCredentials, "password");
        }
        else {
            const imageSrc = webcamRef.current.getScreenshot();

            fetchLogin({ photo: imageSrc }, "face");

            setPhoto(imageSrc);
        }
    };

    const fetchLogin = async (userData, type) => {
        try {
            const response = await fetch(`http://localhost:5000/login/${type}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            const responseData = await response.json();

            if (responseData.message) {
                localStorage.setItem('user', responseData.user);
                localStorage.setItem('authenticated', true);
                navigate("/");
            }
            else {
                setError(responseData.error);
            }
        } catch (error) {
            console.error('Erro durante o cadastro:', error);
        }
    }

    const handleAuthenticationTypeChange = (event, newAuthenticationType) => {
        if (newAuthenticationType !== null) {
            setAuthenticationType(newAuthenticationType);
        }
    };

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container component="main" maxWidth="xs">
                <CssBaseline />
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography component="h1" variant="h5">
                        Login
                    </Typography>
                    <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                        <Typography textAlign="center" color="red">
                            {error}
                        </Typography>
                        {authenticationType == "password" ? (
                            <>
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    id="user"
                                    label="Usuário"
                                    name="user"
                                    autoComplete="user"
                                    autoFocus
                                />
                                <TextField
                                    margin="normal"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Senha"
                                    type="password"
                                    id="password"
                                    autoComplete="current-password"
                                />
                            </>
                        ) : (
                            photo === "" ? (
                                <Webcam
                                    audio={false}
                                    width={396}
                                    ref={webcamRef}
                                    screenshotFormat="image/jpeg"
                                />
                            ) : (
                                <Box
                                    component="img"
                                    sx={{ width: 396 }}
                                    src={photo}
                                />
                            )
                        )}
                        <Grid container justifyContent="center">
                            <Grid item sm={12} sx={{ textAlign: 'center' }}>
                                <ToggleButtonGroup
                                    value={authenticationType}
                                    exclusive
                                    onChange={handleAuthenticationTypeChange}
                                >
                                    <ToggleButton value="password">
                                        <Avatar sx={{ m: 1, bgcolor: 'green' }}>
                                            <Key />
                                        </Avatar>
                                    </ToggleButton>
                                    <ToggleButton value="face">
                                        <Avatar sx={{ m: 1, bgcolor: 'green' }}>
                                            <Face />
                                        </Avatar>
                                    </ToggleButton>
                                </ToggleButtonGroup>
                            </Grid>
                            <Grid item sm={12}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Entrar
                                </Button>
                            </Grid>
                        </Grid>

                        <Grid container justifyContent="flex-end">
                            <Grid item>
                                <Link href="/sign-up" variant="body2">
                                    {"Não tem cadastro? Registre-se"}
                                </Link>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Container>
        </ThemeProvider>
    );
}