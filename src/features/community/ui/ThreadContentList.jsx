import { useThreadContent } from "../../hooks/useThreadContent";
import ContentCard from "../ui/ContentCard";
import { Spinner, Alert } from "../../ui";

export default function ThreadContentList({ threadId }) {
  const { contentItems, loading, error, fetchContent } = useThreadContent();

  useEffect(() => {
    if (threadId) fetchContent(threadId);
  }, [threadId]);

  if (loading) return <Spinner />;
  if (error) return <Alert type="error">{error}</Alert>;
  if (contentItems.length === 0) return <Alert type="info">Este hilo no tiene mensajes ni posts aún.</Alert>;

  return (
    <div style={{ marginTop: 24 }}>
      {contentItems.map(item => (
        <ContentCard key={item.id + item.type} item={item} />
      ))}
    </div>
  );
}