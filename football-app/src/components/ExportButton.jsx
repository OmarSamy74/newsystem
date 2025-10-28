import React from "react";

const ExportButton = ({ events, lineup }) => {
  const formatTimestamp = (timestamp) => {
    const hours = Math.floor(timestamp / 3600);
    const minutes = Math.floor((timestamp % 3600) / 60);
    const seconds = Math.floor(timestamp % 60);
    return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const formatDuration = (duration) => {
    if (duration === undefined || duration === null) return "00:00.0";
    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    const tenths = Math.floor((duration % 1) * 10);
    return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}.${tenths}`;
  };

  const handleExportCSV = () => {
    const csvHeaders = [
      "ID",
      "Timestamp",
      "Duration",
      "Half",
      "Lineup",
      "Event Type",
      "Player",
      "Player Receiver",
      "Player Out",
      "Player In",
      "Team",
      "Start X",
      "Start Y",
      "End X",
      "End Y",
      "Goal Location X",
      "Goal Location Y",
      "Field Location X",
      "Field Location Y",
      "Type",
      "Outcome",
      "Extra Info",
      "Pass Type",
      "Body Part",
      "Save Technique"
    ];

    const csvContent = [
      csvHeaders.join(","),
      ...events.map((event, index) => {
        const row = [
          index + 1,
          `"${formatTimestamp(event.videoTimestamp)}"`,
          `"${formatDuration(event.duration)}"`,
          event.half || "Not Started",
          `"${lineup?.starting?.length || 0} players${lineup?.starting?.length > 0 ? `: ${lineup.starting.map(p => p.name).join(', ')}` : ''}"`,
          event.type || "-",
          event.type === 'Sub' ? "-" : (event.player || "-"),
          ['Ground Pass', 'Low Pass', 'High Pass'].includes(event.type) ? (event.playerReceiver || "-") : "-",
          event.type === 'Sub' ? (event.playerOut || "-") : "-",
          event.type === 'Sub' ? (event.playerIn || "-") : "-",
          event.team || "-",
          ['Shot', 'Ground Pass', 'High Pass', 'Low Pass', 'Press'].includes(event.type) 
            ? (event.startLocation?.x || "-") 
            : "-",
          ['Shot', 'Ground Pass', 'High Pass', 'Low Pass', 'Press'].includes(event.type) 
            ? (event.startLocation?.y || "-") 
            : "-",
          ['Shot', 'Ground Pass', 'High Pass', 'Low Pass', 'Press'].includes(event.type) 
            ? (event.endLocation?.x || "-") 
            : "-",
          ['Shot', 'Ground Pass', 'High Pass', 'Low Pass', 'Press'].includes(event.type) 
            ? (event.endLocation?.y || "-") 
            : "-",
          event.type === 'Shot' 
            ? (event.endLocation?.x || "-") 
            : "-",
          event.type === 'Shot' 
            ? (event.endLocation?.y || "-") 
            : "-",
          !['Shot', 'Ground Pass', 'High Pass', 'Low Pass', 'Press'].includes(event.type) 
            ? (event.startLocation?.x || "-") 
            : "-",
          !['Shot', 'Ground Pass', 'High Pass', 'Low Pass', 'Press'].includes(event.type) 
            ? (event.startLocation?.y || "-") 
            : "-",
          event.technique || "-",
          event.result || "-",
          event.extraInfo !== undefined && event.extraInfo !== null ? `"${event.extraInfo}"` : "-",
          event.passType !== undefined && event.passType !== null ? event.passType : "-",
          event.bodyPart !== undefined && event.bodyPart !== null ? event.bodyPart : "-",
          event.saveTechnique !== undefined && event.saveTechnique !== null ? event.saveTechnique : "-"
        ];
        return row.join(",");
      })
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `football_analysis_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="mt-4 flex justify-end">
      <button
        onClick={handleExportCSV}
        className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md z-50"
      >
        Download file CSV
      </button>
    </div>
  );
};

export default ExportButton;