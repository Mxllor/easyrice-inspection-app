import { Box, Container, Stack, TextField, Typography } from "@mui/material"
import AddIcon from '@mui/icons-material/Add';
import { Search } from "@mui/icons-material";
import IconButton from "../components/IconButton";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
    const [filter, setFilter] = useState("");
    const navigate = useNavigate();
    
    function goToCreatePage() {
        navigate("/create")
    }

    return (
        <>
            <Container maxWidth="xl"  sx={{ mt: 4 }}>
                <Box>
                    {/* CREATION BUTTON */}
                    <Stack direction="row" spacing={2} justifyContent={"flex-end"}>
                        <IconButton buttonName="Create Inspection" onClick={goToCreatePage} icon={<AddIcon />}/>
                    </Stack>

                    {/* SEARCH BAR */}
                    <Stack direction="column" spacing={2} sx={{ mt: 2, padding: "20px 16px" }}>
                        <Box>
                            <Typography variant="h6" >ID</Typography>
                            <TextField 
                                fullWidth 
                                placeholder="Search with ID"
                                value={filter || ""}
                                onChange={(e) => setFilter(e.target.value)}
                                />
                        </Box>
                        <Box display={"flex"} justifyContent={"space-between"} >
                            <Typography 
                                fontSize={14} 
                                fontWeight={600} 
                                fontStyle={"semi-bold"} 
                                color="#D91212" 
                                style={{ textDecoration: "underline", cursor: "pointer" }}
                                onClick={() => setFilter("")}
                                >
                                    Clear Filter
                            </Typography>
                            <IconButton buttonName="Search" icon={<Search />} />
                        </Box>
                    </Stack>

                    {/* Table */}
                    <Stack display={"flex"} justifyContent={"center"} textAlign={"center"}>
                        table
                    </Stack>
                </Box>
            </Container>
        </>
    )
}

export default Landing