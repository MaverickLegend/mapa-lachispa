import { Map as MapComponent } from "./components/Map"; // Adjust the import path as needed
import { Layout } from "./layout/Layout";

function App() {
  return (
    <>
      <Layout>
        <MapComponent />
      </Layout>
    </>
  );
}

export default App;
