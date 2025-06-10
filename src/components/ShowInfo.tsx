import { useMapStore } from "../store/useMapStore";
import { CustomPieChart } from "./CustomPieChart";
import { CustomBarChart } from "./CustomBarChart";

export const ShowInfo = () => {
  const { selectedCommuneData } = useMapStore();

  const pieData = selectedCommuneData?.metadata.totalesGenerales
    ? Object.entries(selectedCommuneData.metadata.totalesGenerales)
        .filter(([key]) => key === "Total de Hombres" || key === "Total de Mujeres")
        .map(([name, value]) => ({ name, value }))
    : [];

  const barData = selectedCommuneData?.metadata.totalesGenerales
    ? Object.entries(selectedCommuneData.metadata.totalesGenerales)
        .filter(
          ([key]) =>
            key === "Total de personas de 0 a 5 años" ||
            key === "Total de personas de 6 a 14 años" ||
            key === "Total de personas de 15 a 64 años" ||
            key === "Total de personas de 65 y más años"
        )
        .map(([name, value]) => ({
          name,
          value,
        }))
    : [];

  return (
    <div className="show-info-container">
      <h1>Seleccione campos válido</h1>
      {selectedCommuneData && (
        <>
          <h1 className="text-black text-center text-2xl mb-4">
            Información sobre la comuna de: {selectedCommuneData?.metadata.t_com_nom}
          </h1>
          <div className="info-container">
            <CustomPieChart data={pieData} key={`pie-${selectedCommuneData?.metadata.t_com}`} />
            <CustomBarChart data={barData} key={`bar-${selectedCommuneData?.metadata.t_com}`} />
          </div>
        </>
      )}
    </div>
  );
};
