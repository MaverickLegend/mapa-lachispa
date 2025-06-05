import { Map as MapComponent } from "./components/Map"; // Adjust the import path as needed
import { MapView } from "./components/MapView";
import { Layout } from "./layout/Layout";

function App() {
  return (
    <>
      <Layout>
        {/* <MapComponent /> */}
        <MapView />
      </Layout>
    </>
  );
}

export default App;
