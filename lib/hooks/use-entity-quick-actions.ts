import { useCallback, useState } from 'react';

import { useTranslation } from '@/lib/i18n';

type DetailActionMenuOptions = {
  onDeleteSuccess?(): void;
};

// Listing screens: long-press selects an entity, then menu → optional inline edit sheet.
export function useListingQuickActions<T>() {
  const { t } = useTranslation();
  const [entity, setEntity] = useState<T | null>(null);
  const [editing, setEditing] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const open = useCallback((item: T) => {
    setDeleteError(null);
    setEntity(item);
  }, []);

  const close = useCallback(() => {
    setEntity(null);
    setEditing(false);
    setDeleteError(null);
  }, []);

  const beginEdit = useCallback(() => setEditing(true), []);

  const remove = useCallback(
    async (deleteFn: (id: string) => Promise<void>, id: string) => {
      try {
        await deleteFn(id);
        close();
      } catch {
        setDeleteError(t('errors.deleteBlocked'));
      }
    },
    [close, t],
  );

  return {
    entity,
    editing,
    deleteError,
    open,
    close,
    beginEdit,
    remove,
    menuVisible: entity !== null && !editing,
    editVisible: entity !== null && editing,
  };
}

// Detail screens: entity is always known; ⋮ opens the same action menu sheet.
export function useDetailActionMenu(options: DetailActionMenuOptions = {}) {
  const { t } = useTranslation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const openMenu = useCallback(() => {
    setDeleteError(null);
    setMenuOpen(true);
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setDeleteError(null);
  }, []);

  const onDeleteSuccess = options.onDeleteSuccess;

  const remove = useCallback(
    async (deleteFn: () => Promise<void>) => {
      try {
        await deleteFn();
        closeMenu();
        onDeleteSuccess?.();
      } catch {
        setDeleteError(t('errors.deleteBlocked'));
      }
    },
    [closeMenu, onDeleteSuccess, t],
  );

  return { menuOpen, deleteError, openMenu, closeMenu, remove };
}
