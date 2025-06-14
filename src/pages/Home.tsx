import { IonContent, IonPage, IonGrid } from '@ionic/react';

import './Home.css';

import MainMenu from '../components/MainMenu';
import Header from '../components/Header';
import TopRow from '../components/TopRow';
import RoundRows from '../components/RoundRows';

const Home: React.FC = () => {
  console.log('Hello world!');
  return (
    <IonPage>
      <MainMenu />
      <Header />
      <IonContent scrollX={true} id="content" fullscreen>
        <div className="sticky-div"></div>
        <IonGrid fixed={false} className="scorecard">
          <TopRow />
          <RoundRows />
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
