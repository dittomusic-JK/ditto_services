# Ditto Services & Royalty Splits - UX Improvements

## Services Page
- **Pre-release Downloads** moved to top of Distribution Services section
- **Purchased tab** restored for viewing purchased services
- **Plan naming** updated: "DittoPlusRLS" renamed to "Label Services"
- **Checkout button** now shows for free services ("Confirm" instead of "Checkout" when £0)
- **Instant grat track selection** uses pill style with white fill when active
- **Pre-release form** right padding added to avoid checkbox column overlap
- **Royalty Splits tab** removed from navigation (accessible via direct URL)

## Royalty Splits - Collaborator Management
- **Collaborator autocomplete** - remembers previously added collaborators across releases
- **Auto-add row** - new split row auto-generates when completing a valid entry (Tab/Enter)
- **Duplicate detection** - warns if adding the same collaborator twice, suggests editing existing split
- **Inline share editing** - edit button on active/rejected splits with Save/Cancel buttons
- **Copy splits** - copy to other tracks shortcut available in first split modal

## Royalty Splits - Status System
- **Simplified statuses**: Active, Pending, Rejected (removed "unclaimed"/"unconfirmed")
- **Pending tooltip**: "The collaborator hasn't accepted their share via email yet"
- **Rejected status**: Red styling with strikethrough on share amount
- **Rejected logic**: User gets their share back (not held as pending)
- **Edit rejected splits**: Changes status back to pending and resends offer

## Royalty Splits - Visual Feedback
- **Color consistency**: User = blue, Active collaborators = green, Pending = amber
- **Toast notifications** for save, remove, resend, copy actions
- **User share preview**: Shows "75% → 70% (pending)" when changes are pending
- **Share bar tooltip**: Updated to "Current active split"
- **Track row tinting**: Green for confirmed, amber for pending, red for rejected-only

## Royalty Splits - Form UX
- **Keyboard shortcuts**: ⌘+Enter to save, Escape to close editor
- **Inline validation**: "Exceeds 100%" warning shown as you type
- **Status date display**: Desktop shows "Active" with date in tooltip; mobile shows full date

## Technical
- **Vue Router** with `/services` and `/royalty-splits` routes
- **Vercel config** for client-side routing support
- **Mobile-responsive** layouts throughout
