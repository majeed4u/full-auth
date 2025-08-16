# Frontend Component Organization

This document outlines the new organized structure for the frontend components.

## New Folder Structure

```
src/components/
├── common/                 # Reusable utility components
│   ├── loader.tsx         # Loading spinner component
│   ├── mode-toggle.tsx    # Theme switcher component
│   └── index.ts           # Barrel export
├── layout/                # Layout-related components
│   ├── header.tsx         # Main header component
│   ├── user-menu.tsx      # User dropdown menu
│   └── index.ts           # Barrel export
├── features/              # Feature-specific components
│   ├── dashboard/         # Dashboard feature components
│   │   ├── dashboard-header.tsx
│   │   ├── security-card.tsx
│   │   ├── tasks-overview-card.tsx
│   │   └── index.ts
│   ├── security/          # Security/2FA feature components
│   │   ├── password-form.tsx
│   │   ├── qr-code-display.tsx
│   │   ├── totp-verification.tsx
│   │   ├── backup-codes-display.tsx
│   │   ├── two-factor-status.tsx
│   │   ├── two-factor-enable.tsx
│   │   ├── two-factor-manage.tsx
│   │   ├── two-factor-disable.tsx
│   │   ├── two-factor-settings-refactored.tsx
│   │   └── index.ts
│   └── tasks/             # Future task management components
│       └── index.ts
├── auth/                  # Authentication components (existing)
├── ui/                    # Base UI components (existing)
└── index.ts               # Main barrel export
```

## Benefits of This Organization

### 1. **Feature-Based Organization**
- Components are grouped by feature/domain rather than by type
- Easy to find all components related to a specific feature
- Better scalability as features grow

### 2. **Separation of Concerns**
- **Common**: Reusable utility components
- **Layout**: Structure and navigation components
- **Features**: Business logic components grouped by feature
- **UI**: Base design system components

### 3. **Smaller, Focused Components**
- Large components broken into smaller, single-responsibility components
- Easier to test, maintain, and reuse
- Better code readability

### 4. **Clear Boundaries**
- Each folder has a specific purpose
- Dependencies flow in one direction
- Easier to understand component relationships

## Component Breakdown Examples

### Two-Factor Settings (Before vs After)

**Before**: One large 571-line component handling everything

**After**: Broken into focused components:
- `TwoFactorStatus` - Status display
- `PasswordForm` - Reusable password input form
- `QRCodeDisplay` - QR code presentation
- `TOTPVerification` - TOTP code verification
- `BackupCodesDisplay` - Backup codes presentation
- `TwoFactorEnable` - Enable 2FA flow
- `TwoFactorManage` - Manage existing 2FA
- `TwoFactorDisable` - Disable 2FA flow
- `TwoFactorSettings` - Main orchestrator component

### Dashboard Page (Before vs After)

**Before**: Mixed layout and business logic in one file

**After**: Clean separation:
- `DashboardHeader` - Welcome message and title
- `SecurityCard` - 2FA status and quick access
- `TasksOverviewCard` - Task summary (placeholder)
- Main page only handles routing and session logic

## Import Examples

```tsx
// Feature components
import { DashboardHeader, SecurityCard } from "@/components/features/dashboard";
import { TwoFactorSettings, PasswordForm } from "@/components/features/security";

// Layout components
import { Header, UserMenu } from "@/components/layout";

// Common components
import { Loader, ModeToggle } from "@/components/common";

// Or import everything from the main index
import { DashboardHeader, SecurityCard, Header, Loader } from "@/components";
```

## Best Practices

### 1. **Single Responsibility**
Each component should have one clear purpose and responsibility.

### 2. **Prop Interface Design**
- Clear, specific prop interfaces
- Use callback props for communication with parent components
- Avoid prop drilling by keeping components focused

### 3. **Reusability**
- Components in `common/` should be highly reusable
- Feature components can be specific but should avoid tight coupling

### 4. **File Naming**
- Use kebab-case for file names
- Component names should be descriptive and clear
- Include the feature name in component names when helpful

### 5. **Barrel Exports**
- Each folder has an `index.ts` file for clean imports
- Export components and types that should be public
- Keep internal implementation details private

## Future Improvements

1. **Add Storybook** for component documentation and testing
2. **Create component templates** for consistent new component creation
3. **Add prop validation** with TypeScript strict mode
4. **Implement component testing** for each small component
5. **Add performance optimizations** like memo and lazy loading where appropriate

## Migration Guide

When adding new components:

1. **Identify the feature/domain** the component belongs to
2. **Create focused, small components** instead of large ones
3. **Use the appropriate folder** (`common`, `layout`, `features`)
4. **Export from the folder's index.ts**
5. **Update the main components index.ts** if needed

This organization makes the codebase more maintainable, testable, and scalable as your application grows.
