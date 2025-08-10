import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';

const TalentCards = [
  {
    id: 1,
    title: 'Claudia Mel',
    urlPhoto: '/img/claudia.jpg',
    description: 'Variété | 2 Singles',
  },
  {
    id: 2,
    title: 'Elimann',
    urlPhoto: '/img/eliman.jpg',
    description: 'Variété | 2 Singles',
  },
  {
    id: 3,
    title: 'Maxi Roxy',
    urlPhoto: '/img/maxy.jpg',
    description: 'Variété | 2 Singles',
  },
];

function AlreadyProduced() {

  return (
<>
  <Typography variant="h4" align="center" gutterBottom fontWeight={"bold"} sx={{ mt: 4, mb: 2, color: '#fff', backgroundColor: '#861e81', padding: '10px', borderRadius: '8px', width: '80%', mx: 'auto' }}>
  Les talents déjà produits
  </Typography>

  <Box
    sx={{
      width: '100%',
      maxWidth: '1200px', // limite la largeur pour éviter que ce soit trop large
      mx: 'auto',          // centre horizontalement
      my: 4,               // marge verticale
      p: 2,                // padding interne
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: 3,              // espace entre les cartes
    }}
  >
    {TalentCards.map((card) => (
      <Card key={card.id}>
        <CardActionArea
        //   onClick={() => setSelectedCard(index)}
          sx={{
            height: '100%',
          }}
        >
          <div className="max-w-sm rounded-xl shadow-lg overflow-hidden bg-white">
            <div className="relative">
                <img src={card.urlPhoto} alt={card.title} className="w-full h-48 object-cover"/>
            </div>

            <div className="bg-[#3d033a] text-white text-center py-2 font-bold text-xl">
              {card.title}
            </div>
            <div className="bg-[#3d033a] text-white text-center py-2">
              {card.description}
            </div>
            <div className="bg-[#3d033a] text-white text-center py-2">
                Produit par ELIWOOD STUDIO
            </div>

          </div>
        </CardActionArea>
      </Card>
    ))}
  </Box>
</>

  );
}

export default AlreadyProduced;
