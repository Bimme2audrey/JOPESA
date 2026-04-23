interface ToastProps {
  show: boolean;
  message: string;
  type?: string;
}

export default function Toast({ show, message, type }: ToastProps) {
  if (!show) return null;
  
  return (
    <div id="toast" className={`show ${type}`}>
      {message}
    </div>
  );
}
