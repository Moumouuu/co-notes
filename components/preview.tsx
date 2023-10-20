import { useEffect, useState } from "react";

function LinkPreview({ url }: { url: string }) {
  const [previewData, setPreviewData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url, {
          method: "GET",
          mode: "cors", // Activer le mode CORS
          headers: {
            "Access-Control-Allow-Origin": "http://localhost:3000", // Remplacez par l'URL de votre site en développement
          },
        });
        const data = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, "text/html");
        const title = doc.querySelector("title")?.textContent || "";
        const description =
          doc
            .querySelector('meta[name="description"]')
            ?.getAttribute("content") || "";
        const image =
          doc
            .querySelector('meta[property="og:image"]')
            ?.getAttribute("content") || "";

        setPreviewData({ title, description, image });
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (!previewData) {
    return <p>Failed to fetch link preview.</p>;
  }

  const handleClick = () => {
    window.open(url, "_blank");
  };

  return (
    <div onClick={handleClick} style={{ cursor: "pointer" }}>
      <h3>{previewData.title}</h3>
      <p>{previewData.description}</p>
      {previewData.image && <img src={previewData.image} alt="Link Preview" />}
    </div>
  );
}

export default LinkPreview;
