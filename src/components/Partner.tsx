import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';


function Partner() {



  return (
    <Box>
    <Box sx={{ my: 2 }}>
        <Typography variant="h6" sx={{ color: '#861e81', fontWeight: 'bold' }}>
            Ils nous font confiance
        </Typography>
    </Box>
    <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 2 }}>
        <img src="/img/logo-black.png" alt="Partner 1" style={{ height: 50 }} />
        <img src="/img/zik.jpg" alt="Partner 2" style={{ height: 50 }} />
    </Box>
    <Box sx={{ justifyContent: 'center', flexWrap: 'wrap', gap: 2, mb: 2 , alignItems: 'center', display: 'flex', flexDirection: 'column' }}>
        <img src="/img/pub.png" alt="Partner 2" style={{  }} />
        <img src="/img/t4.jpg" alt="Partner 1" style={{ width: '80%' }} />
    </Box>
      <Divider />
    </Box>
  );
}


export default Partner;
