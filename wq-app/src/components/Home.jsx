import React from 'react';
import { Grid, Header, Button } from 'semantic-ui-react';

const Home = () => {
  return (
    <div>
      <Grid stackable columns>
        <Header as='h1'>Home</Header>
        <Button>Home</Button>
      </Grid>
    </div>
  );

}

export default Home;