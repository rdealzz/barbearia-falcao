/**
 * Estado compartilhado dos formulários com Server Actions.
 * Fica fora dos arquivos "use server", que só podem exportar funções async.
 */
export interface ActionState {
  status: 'idle' | 'success' | 'error';
  message?: string;
  errors?: Record<string, string>;
}

export const initialActionState: ActionState = { status: 'idle' };
