sed -i 's/export default function App() {/export default function App() {\n  const [isDialOpen, setIsDialOpen] = React.useState(false);/g' src/App.tsx
