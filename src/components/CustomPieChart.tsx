import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { useEffect } from "react";
import { renderToPipeableStream } from "react-dom/server";

interface DataItem {
  name: string;
  value: number;
}

interface CustomPieChartProps {
  data: DataItem[];
  colors?: string[];
  width?: number | string;
  height?: number | string;
}

export const CustomPieChart = ({
  data,
  colors = ["#0088FE", "#00C49F"],
  width = "100%",
  height = "100%",
}: CustomPieChartProps) => {
  const label = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  // Debug: Verifica que los datos lleguen correctamente
  useEffect(() => {
    console.log("Datos recibidos en CustomPieChart:", data);
    console.log("Dimensiones:", { width, height });
  }, [data]);

  if (!data || data.length === 0) {
    console.log("No hay datos válidos para mostrar");
    return (
      <div
        style={{
          width: typeof width === "number" ? `${width}px` : width,
          height: typeof height === "number" ? `${height}px` : height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px dashed #ccc",
          color: "#666",
        }}>
        No hay datos disponibles para el gráfico
      </div>
    );
  }

  return (
    <div
      style={{
        width: typeof width === "number" ? `${width}px` : width,
        height: typeof height === "number" ? `${height}px` : height,
      }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={label}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
