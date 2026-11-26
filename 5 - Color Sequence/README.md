# Reusable Components & Props Lab

## Objective
- To be able to create your own Component/s
- To apply knowledge of Reusable Component
- To utilize Props for Parameter Passing

## Instructions
1. Refer to the video attached.
2. Create a React Project and create reusable components with props concept.
3. Answer the questions below.

## Setup and Run

```bash
npm install
npm run dev
```

Open the printed local URL (default `http://localhost:5173`).

---

## Answers

### 1. Where is data being passed from parent to child, and how do props make this possible?

`App.jsx` is the parent — it owns the board data (`boardColors`, an array of color
objects) and the interaction state (`revealed`, `wrongBox`). When it renders the
grid, it maps over `boardColors` and passes each color's data down into a
`ColorButton` (the child) as props:

```jsx
{boardColors.map((color, index) => (
  <ColorButton
    key={color.name}
    color={color.value}
    isRevealed={revealed.includes(index)}
    isWrong={wrongBox === index}
    onClick={() => handleBoxClick(index)}
    disabled={wrongBox !== null || gameComplete}
  />
))}
```

Props make this possible because React components are just functions —
whatever attributes you write on a JSX tag (`color={...}`, `isRevealed={...}`,
etc.) get collected into a single object and passed as the function's
argument. `ColorButton` receives that object and destructures it:

```jsx
function ColorButton({ color, isRevealed, isWrong, onClick, disabled }) { ... }
```

Data always flows one direction — parent to child — which is what makes props
predictable: the child never has to guess where its data came from, and the
parent stays the single source of truth for the board state.

### 2. If we wanted to change the grid size from 3x3 to 4x4, which parts of your code need to change and why?

Two places:

1. **The CSS grid definition**, so the browser lays out 4 columns instead of 3:
   ```css
   .board { grid-template-columns: repeat(4, 1fr); }
   ```
2. **The data array that gets mapped**, so there are 16 boxes instead of 9. The
   board is built by mapping over `boardColors`/`sequence`, so the array
   itself needs 16 color entries (or a repeated/generated set) instead of 9:
   ```js
   const baseSequence = [ /* ...16 color objects instead of 9... */ ]
   ```

Nothing in `ColorButton.jsx` needs to change — that's the point of a
reusable component. It doesn't know or care how many times it gets rendered;
it just renders whatever single color object it's given. The grid size is
purely a function of (a) how many items are in the array being mapped, and
(b) how many columns the CSS tells the browser to lay them out in.

### 3. Look at your grid. How does creating a single Box component save you from writing repetitive HTML code?

Without a component, drawing a 3x3 grid would mean writing out 9 nearly
identical `<button>` blocks by hand — same classes, same structure, only the
color/state different each time — and doing it again for every size change.

Instead, `ColorButton` is written **once**, describing what a single grid
square looks like and how it behaves:

```jsx
function ColorButton({ color, isRevealed, isWrong, onClick, disabled }) {
  return (
    <button
      className={/* ...className logic... */}
      style={isRevealed ? { backgroundColor: color } : undefined}
      onClick={onClick}
      disabled={disabled || isRevealed}
    />
  )
}
```

Then `.map()` reuses that one definition for every item in the data array:

```jsx
{boardColors.map((color, index) => <ColorButton key={color.name} ... />)}
```

Adding, removing, or resizing the grid is now a data change (edit the array),
not a markup change (edit 9+ copy-pasted blocks). If a bug needs fixing or the
hover style needs updating, it's fixed in one file and every square on the
board updates automatically.

### 4. If you remove the color prop from the Box component, what happens to the grid squares on your screen? Why?

They'd all fall back to the CSS default background (`#4b9d95`, a flat teal)
and **stay that color permanently — even after a correct guess.**

That's because `ColorButton` only shows a square's real color when it's
revealed, and it does that by using the `color` prop as an inline style:

```jsx
style={isRevealed ? { backgroundColor: color } : undefined}
```

If `color` is never passed in, that line has nothing to apply — `color` is
`undefined`, so `backgroundColor: undefined` is effectively ignored by React,
and the square just keeps whatever the CSS class already gives it. Visually,
every box would look identical (same teal, same shape) whether it's hidden,
correctly guessed, or untouched — you'd lose all visual feedback that
progress is happening, since the box's identity (which color it "is") only
exists because the parent passes it down as a prop. The component has no way
to know its own color otherwise.
