import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import { CalendarDays } from "lucide-react";

const ActualityCards = [
  {
    id: 1,
    title: 'SEANCE ECOUTE ZIK TALENT',
    description: '« URBAN TALENT» est un concept qui permet de détecter, révéler et faire la promotion des talents dan...',
    datePublication: 'Publié le: 2025-02-02',
    urlImg: '/img/claudia.jpg',
    
  },
  {
    id: 2,
    title: 'SEANCE ECOUTE ZIK TALENT',
    description: '« URBAN TALENT» est un concept qui permet de détecter, révéler et faire la promotion des talents dan...',
    datePublication: 'Publié le: 2025-02-02',
    urlImg: '/img/claudia.jpg',
  },
  {
    id: 3,
    title: 'SEANCE ECOUTE ZIK TALENT',
    description: '« URBAN TALENT» est un concept qui permet de détecter, révéler et faire la promotion des talents dan...',
    datePublication: 'Publié le: 2025-02-02',
    urlImg: '/img/claudia.jpg',
  },
  {
    id: 4,
    title: 'SEANCE ECOUTE ZIK TALENT',
    description: '« URBAN TALENT» est un concept qui permet de détecter, révéler et faire la promotion des talents dan...',
    datePublication: 'Publié le: 2025-02-02',
    urlImg: '/img/claudia.jpg',
  },
];

function Actuality() {

  return (
<>
  <Typography variant="h4" align="center" gutterBottom fontWeight={"bold"} sx={{ mt: 4, mb: 2 }}>
    Les actualités
  </Typography>

  <Box
    sx={{
      width: '100%',
      maxWidth: '1200px', // limite la largeur pour éviter que ce soit trop large
      mx: 'auto',          // centre horizontalement
      my: 4,               // marge verticale
      p: 2,                // padding interne
      display: 'grid',
      gridTemplateColumns: {
        xs: 'repeat(1, 1fr)',   // Mobile : 1 carte par ligne
        sm: 'repeat(2, 1fr)',   // Tablette : 2 cartes par ligne
        md: 'repeat(4, 1fr)',   // Desktop : 4 cartes par ligne
      },
      gap: 3,              // espace entre les cartes
    }}
  >
    {ActualityCards.map((card) => (
      <Card key={card.id}>
        <CardActionArea
        //   onClick={() => setSelectedCard(index)}
          sx={{
            height: '100%',
          }}
        >
          <div className="max-w-sm rounded-xl shadow-lg overflow-hidden bg-white">
            <div className="relative">
                <img src={card.urlImg} alt={card.title} className="w-full h-48 object-cover"/>
            </div>

            <div className="text-black text-center py-2 font-bold text-xl">
              {card.title}
            </div>

            <div className="px-2 py-2 text-center">
              <p className="text-black text-center">{card.description}</p>
              <div className="text-black text-center py-2 font-bold text-xl flex items-center justify-center display-flex">
              <CalendarDays size={20} />
              {card.datePublication}
                </div>
              <button className="mt-4 w-full bg-gradient-to-r from-fuchsia-700 to-purple-700 hover:bg-purple-900 text-white font-semibold py-2 px-4 rounded-lg transition duration-300">
                Voir plus
              </button>
            </div>
          </div>
        </CardActionArea>
      </Card>
    ))}
  </Box>
</>

  );
}

export default Actuality;
