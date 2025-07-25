import { Container, Box, Stack, Typography, TextField, Divider } from "@mui/material"

function Create() {
    return (
        <>
            <Container maxWidth="xl"  sx={{ mt: 4 }}>
                <Box display={"column"} justifyItems={"center"}>
                    <Stack direction="row" spacing={2} justifyContent={"center"}>
                        <Typography variant="h4" >Create Inspection</Typography>
                    </Stack>
                    <Stack direction="column" spacing={2} justifyContent={"center"} sx={{ mt: 2, padding: "20px 16px" }} >
                        <Box>
                            <Typography variant="h6" >Name*</Typography>
                            <TextField 
                                placeholder="Search with ID"
                                value={""}
                                onChange={() => {}}
                            />
                        </Box>
                        <Box>
                            <Typography variant="h6" >Standard*</Typography>
                            <TextField 
                                placeholder="Search with ID"
                                value={""}
                                onChange={() => {}}
                            />
                        </Box>
                        <Divider />
                        <Box>
                            <Typography variant="h6" >Note*</Typography>
                            <TextField 
                                placeholder="Search with ID"
                                value={""}
                                onChange={() => {}}
                            />
                        </Box>
                    </Stack>
                </Box>
            </Container>
        </>
    );
}

export default Create