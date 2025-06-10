import { useEffect, useState } from "react";
import { useMapStore } from "../store/useMapStore";
import { CustomPieChart } from "./CustomPieChart";

export const ShowInfo = () => {
  const { selectedCommuneData, selectedUnidadVecinalData } = useMapStore();
  const [showCommuneData, setShowCommuneData] = useState(true);
  const [showUVData, setShowUVData] = useState(false);

  const { selectedRegion, regionGeoJSON, selectedUnidadVecinal } = useMapStore();

  const pieData = selectedCommuneData?.metadata.totalesGenerales
    ? Object.entries(selectedCommuneData.metadata.totalesGenerales)
        .filter(([key]) => key === "Total de Hombres" || key === "Total de Mujeres")
        .map(([name, value]) => ({ name, value }))
    : [];

  useEffect(() => {
    console.log(pieData);
    if (selectedUnidadVecinalData) {
      setShowCommuneData(false);
      setShowUVData(true);
    } else {
      setShowCommuneData(true);
      setShowUVData(false);
    }
  }, [selectedUnidadVecinalData, selectedCommuneData]);

  useEffect(() => {
    // Cuando se selecciona una unidad vecinal, contraemos los datos de la comuna
    if (selectedUnidadVecinalData) {
      setShowCommuneData(false);
      setShowUVData(true);
    } else {
      // Si no hay unidad vecinal seleccionada, mostramos los datos de la comuna
      setShowCommuneData(true);
      setShowUVData(false);
    }
  }, [selectedUnidadVecinalData, selectedCommuneData]);

  return (
    <div>
      {selectedRegion && <CustomPieChart data={pieData} colors={["#36A2EB", "#FF6384"]} />}

      {selectedRegion && (
        <div style={{ marginTop: "1rem", fontSize: "0.8rem", color: "black" }}>
          <strong>{selectedRegion?.name}</strong>
          <br />
          Unidades vecinales: {regionGeoJSON?.features.length}
        </div>
      )}
      {selectedUnidadVecinal && (
        <div style={{ fontSize: "0.8rem", marginTop: "0.5rem", color: "#666" }}>
          📍 UV seleccionada: <strong>{selectedUnidadVecinal}</strong>
          <br />
        </div>
      )}
      <div>
        {selectedCommuneData && showCommuneData && (
          <div className="uv-info-panel">
            {Object.entries(selectedCommuneData.metadata.totalesGenerales).map(([key, value]) => (
              <div key={key}>
                <strong>{key.replace(/_/g, " ")}:</strong>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
        {selectedUnidadVecinalData && showUVData && (
          <div className="uv-info-panel">
            {Object.entries(selectedUnidadVecinalData).map(([key, value]) => (
              <div key={key}>
                <strong>{key.replace(/_/g, " ")}:</strong>
                <p>{value}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
