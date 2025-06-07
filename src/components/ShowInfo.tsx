import { useEffect, useState } from "react";
import { useMapStore } from "../store/useMapStore";

export const ShowInfo = () => {
  const { selectedCommuneData, selectedUnidadVecinalData } = useMapStore();
  const [showCommuneData, setShowCommuneData] = useState(true);
  const [showUVData, setShowUVData] = useState(false);

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
  }, [selectedUnidadVecinalData]);

  return (
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
  );
};
