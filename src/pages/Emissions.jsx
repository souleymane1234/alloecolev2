import React from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';
import EmissionCard from '../components/EmissionCard';
import Partner from '../components/Partner';
import AlreadyProduced from '../components/AlreadyProduced';
import HeadBanner from '../components/HeadBanner';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: (theme.vars ?? theme).palette.text.secondary,
  ...theme.applyStyles('dark', {
    backgroundColor: '#1A2027',
  }),
}));

const Emissions = () => {
  return (
    <>
    <HeadBanner />
    <EmissionCard titleComponent="Toutes nos émissions" titleButton="Participer"/>
    <Partner />
    <AlreadyProduced />
    </>
  );
};

export default Emissions;