/**
 * Card reutilizable para mostrar tanto posts como mensajes.
 * Si es post, muestra imagen/video si existe.
 */
export default function ContentCard({ item }) {
  return (
    <div className="content-card" style={{
      border: "1px solid #ccc", borderRadius: 8, padding: 16, marginBottom: 16
    }}>
      <div style={{ marginBottom: 8 }}>
        <strong>
          {item.type === "post" ? "Post" : "Mensaje"}
        </strong>
        <span style={{ float: "right", color: "#999" }}>
          {new Date(item.createdAt).toLocaleString()}
        </span>
      </div>
      <div style={{ marginBottom: 8 }}>{item.content}</div>
      {/* Si es post y tiene multimedia, mostrarla */}
      {item.type === "post" && (
        <div>
          {item.mediaType === "image" && (
            <img src={item.mediaUrl} alt="Imagen del post" style={{ maxWidth: "100%", marginTop: 8 }} />
          )}
          {item.mediaType === "video" && (
            <video controls style={{ maxWidth: "100%", marginTop: 8 }}>
              <source src={item.mediaUrl} type="video/mp4" />
              Tu navegador no soporta videos.
            </video>
          )}
        </div>
      )}
    </div>
  );
}