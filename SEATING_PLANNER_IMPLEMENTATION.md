# Seating Planner Implementation

## Overview
The seating planner feature has been fully implemented with Supabase integration, allowing users to create tables, assign guests to seats, and manage their wedding seating arrangements.

## Components Created/Updated

### 1. Library Functions (`app/lib/seating.ts`)
Created a new library file with Supabase operations:
- `getSeatingChartByWeddingId()` - Fetch seating chart for a wedding
- `createSeatingChart()` - Create a new seating chart
- `updateSeatingChart()` - Update existing seating chart
- `upsertSeatingChart()` - Insert or update seating chart (used for auto-save)
- `deleteSeatingChart()` - Delete a seating chart

### 2. Seating Context (`app/contexts/seating-context.tsx`)
Updated the context to integrate with Supabase:

#### Features:
- **Auto-load**: Fetches seating chart from database on mount
- **Auto-save**: All operations automatically persist to Supabase
- **Real-time state management**: Local state updates immediately, then syncs to database
- **Loading states**: Proper loading indicators while fetching data

#### API Methods:
- `addTable(table)` - Add a new table (async)
- `updateTable(id, updates)` - Update table properties (async)
- `deleteTable(id)` - Remove a table (async)
- `assignGuestToSeat(tableId, seatNumber, guestId, guestName)` - Assign guest to seat (async)
- `unassignSeat(tableId, seatNumber)` - Remove guest from seat (async)
- `getTotalSeatedGuests()` - Get count of seated guests
- `autoAssignGuests(guests)` - Automatically distribute guests across tables (async)
- `refreshSeatingChart()` - Manually refresh from database

### 3. Seating Planner Page (`app/components/pages/seating-planner-page.tsx`)
Updated to handle async operations:
- All button handlers now properly await async operations
- Added loading state with spinner
- Improved error handling
- Better user feedback during operations

## Database Schema
Uses the existing `seating_charts` table from the schema:
```sql
CREATE TABLE seating_charts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wedding_id UUID NOT NULL REFERENCES weddings(id) ON DELETE CASCADE UNIQUE,
  tables JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## Data Structure
Tables are stored as JSONB array with the following structure:
```typescript
interface Table {
  id: string;
  name: string;
  shape: "round" | "rectangle";
  seats: number;
  assignedSeats: TableSeat[];
  position?: { x: number; y: number };
  color?: string;
  notes?: string;
}

interface TableSeat {
  seatNumber: number;
  guestId?: string;
  guestName?: string;
}
```

## Key Features

### 1. Visual & List Views
- Toggle between visual floor plan and list view
- Visual view shows tables in a grid with seat occupancy
- List view shows detailed table information

### 2. Guest Assignment
- Drag-and-drop style assignment (click-based)
- Unseated guests panel shows guests needing seats
- One-click assignment to selected table
- Prevents double-booking (guest can only be at one seat)

### 3. Auto-Assignment
- Intelligent distribution of unseated guests across tables
- Respects table capacity
- Only assigns confirmed guests (RSVP status = "yes")
- Skips already seated guests

### 4. Table Management
- Add/edit/delete tables
- Configure seats, shape, color, and notes
- Real-time seat availability tracking
- Visual indicators for full/empty tables

### 5. Statistics
- Total guests, seated count, table count
- Seating progress percentage
- Average guests per table
- Empty seats count

### 6. Data Persistence
- All changes automatically saved to Supabase
- One seating chart per wedding (enforced by unique constraint)
- Upsert pattern prevents duplicate charts

## Integration Points

### Guest List Integration
- Pulls confirmed guests from `GuestListContext`
- Shows guest details (relationship, meal preference)
- Filters unseated guests automatically

### Authentication
- Uses `AuthContext` to get current user
- Fetches wedding ID based on user
- Respects RLS policies

### Navigation
- Back button to guest list
- Integrated with app navigation

## User Experience

### Loading States
- Shows spinner while loading seating chart
- Prevents interaction during data fetch
- Clear loading message

### Error Handling
- Console logging for debugging
- Graceful fallbacks for missing data
- User-friendly error messages

### Responsive Design
- Mobile-first approach
- Grid layout adapts to screen size
- Touch-friendly buttons and controls

## Future Enhancements (Optional)
1. Drag-and-drop table positioning on visual map
2. Export seating chart as PDF
3. Share seating chart via link
4. AI-powered seating suggestions based on relationships
5. Table templates (common layouts)
6. Guest grouping by relationship/meal preference
7. Conflict detection (e.g., separated guests)
8. Print-friendly view

## Testing Checklist
- ✅ Create new tables
- ✅ Edit table properties
- ✅ Delete tables
- ✅ Assign guests to seats
- ✅ Unassign guests from seats
- ✅ Auto-assign unseated guests
- ✅ Data persists after page reload
- ✅ Loading states work correctly
- ✅ Multiple tables can be managed
- ✅ Guest list integration works
- ✅ Statistics calculate correctly

## Notes
- The seating chart is stored as JSONB in Supabase, providing flexibility for future schema changes
- The implementation uses optimistic updates (UI updates immediately, then syncs to DB)
- All async operations are properly awaited to prevent race conditions
- The context handles both empty state (no seating chart) and populated state seamlessly
