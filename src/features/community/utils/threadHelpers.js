// Utilidad para validar hilos antes de procesarlos
export function isThreadValid(thread) {
  return (
    thread &&
    typeof thread.title === "string" &&
    typeof thread.content === "string"
  );
}