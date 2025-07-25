import { Button, Typography } from "@mui/material";

function IconButton( props: any ) {
    return (
        <>
            <Button onClick={props.onClick} variant="contained" style={{ textTransform: "none" }} sx={{ borderRadius: "6px", bgcolor: "#1F7B44", color: "white" }} startIcon={props.icon}>
                <Typography fontSize={14} fontWeight={600} fontStyle={"semi-bold"} >
                    { props.buttonName }
                </Typography>
            </Button>
        </>
    );
}

export default IconButton