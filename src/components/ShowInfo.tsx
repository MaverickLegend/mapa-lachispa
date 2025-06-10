import { useMapStore } from "../store/useMapStore";
import { CustomPieChart } from "./CustomPieChart";
import { CustomBarChart } from "./CustomBarChart";

export const ShowInfo = () => {
  const { selectedCommuneData, selectedUnidadVecinalData } = useMapStore();

  let pieData: { name: string; value: number }[] = [];
  let barData: { name: string; value: number }[] = [];
  let title = "";
  let showCharts = false;

  if (selectedUnidadVecinalData) {
    pieData = Object.entries(selectedUnidadVecinalData)
      .filter(([key]) => key === "Total de Hombres" || key === "Total de Mujeres")
      .map(([name, value]) => ({ name, value: Number(value) }));

    barData = Object.entries(selectedUnidadVecinalData)
      .filter(
        ([key]) =>
          key === "Total de personas de 0 a 5 años" ||
          key === "Total de personas de 6 a 14 años" ||
          key === "Total de personas de 15 a 64 años" ||
          key === "Total de personas de 65 y más años"
      )
      .map(([name, value]) => ({ name, value: Number(value) }));

    title = `Información de Unidad Vecinal: ${selectedUnidadVecinalData["NOMBRE UNIDAD VECINAL"]} `;
    showCharts = true;
  } else if (selectedCommuneData?.metadata?.totalesGenerales) {
    // Process Commune data
    pieData = Object.entries(selectedCommuneData.metadata.totalesGenerales)
      .filter(([key]) => key === "Total de Hombres" || key === "Total de Mujeres")
      .map(([name, value]) => ({ name, value: Number(value) }));

    barData = Object.entries(selectedCommuneData.metadata.totalesGenerales)
      .filter(
        ([key]) =>
          key === "Total de personas de 0 a 5 años" ||
          key === "Total de personas de 6 a 14 años" ||
          key === "Total de personas de 15 a 64 años" ||
          key === "Total de personas de 65 y más años"
      )
      .map(([name, value]) => ({ name, value: Number(value) }));

    title = `Información sobre la comuna de: ${selectedCommuneData.metadata.t_com_nom}`;
    showCharts = true;
  }

  if (!showCharts) {
    return (
      <div className="show-info-container">
        <h1>Seleccione campos válidos</h1>
      </div>
    );
  }

  return (
    <div className="show-info-container">
      <h1 className="text-black text-center text-2xl mb-4">{title}</h1>
      <div className="info-container">
        <CustomPieChart
          data={pieData}
          key={selectedUnidadVecinalData ? "pie-uv" : `pie-${selectedCommuneData?.metadata.t_com}`}
        />
        <CustomBarChart
          data={barData}
          key={selectedUnidadVecinalData ? "bar-uv" : `bar-${selectedCommuneData?.metadata.t_com}`}
        />
      </div>
    </div>
  );
};
