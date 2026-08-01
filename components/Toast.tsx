interface ToastProps {
  show: boolean;
  message: string;
  type?: 'success' | 'warning' | 'error';
}

export default function Toast({ show, message, type = 'success' }: ToastProps) {
  if (!show) return null;

  const tone = type === 'error' ? 'error' : type === 'warning' ? 'warning' : 'success';

  return (
    <div id="toast" className={`show ${tone}`}>
      {message}
    </div>
  );
}
