import { Typography } from "@mui/material";

function NotFound() {
    return (
        <div>
            <Typography variant="h4" component="h1">404 Not Found</Typography>
            <Typography variant="h6" component="h2">The page you are looking for does not exist.</Typography>
            <Typography variant="body1"
                sx={{ textDecoration: "underline", cursor: "pointer", color: "blue" }}
                onClick={() => { window.location.href = "/" }}
            >
                Home Page.
            </Typography>
        </div>
    );
}

export default NotFound