import { Box, Button, Checkbox, Container, Grid, NumberInput, Space, Title } from "@mantine/core"
import { useState } from "react"
import "./App.css"

const App = () => {
  const [weight, setWeight] = useState<number | "">()
  const [percent, setPercent] = useState<number | "">(100)

  const [selected, setSelected] = useState<number[]>([])
  const [calculated, setCalculated] = useState<number[]>([])

  const handleCalculate = () => {
    const finalPercent = (percent || 0) * 0.01
    const finalWeight = isNaN(weight || 0)
      ? (weight as number) * finalPercent
      : parseInt(weight?.toString() || "0") * finalPercent

    setCalculated(selected.map((s) => s * 0.01 * finalWeight))
  }

  const handleSetSelected = (value: number) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
      return
    }
    setSelected((oldValues) => [...new Set([...oldValues, value])])
  }

  console.log(33 % 1)

  return (
    <Container h="100%" px="xl" py="xl" sx={{ boxSizing: "border-box" }}>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          height: "calc(100% - 48px)",
        }}
      >
        <Box>
          <Title pb="sm" order={1}>
            Weight
          </Title>
          <NumberInput
            variant="default"
            placeholder="80 kg"
            onChange={setWeight}
            precision={2}
            min={0}
            value={weight}
            size="xl"
          />
          <Space h="md" />

          <Title order={1} pb="sm">
            Weight %
          </Title>
          <NumberInput
            variant="default"
            min={0}
            value={percent}
            placeholder="95%"
            onChange={setPercent}
            step={5}
            size="xl"
          />
        </Box>
        <Space h="md" />
        <Box>
          <Grid gutter={"sm"}>
            {[10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100].map(
              (value) => (
                <Grid.Col span={3} key={value}>
                  <Button
                    variant={selected.find((v) => v === value) ? "filled" : "light"}
                    onClick={() => handleSetSelected(value)}
                  >
                    {value}%
                  </Button>
                </Grid.Col>
              )
            )}
          </Grid>
          <Box mt="xl" w="100%">
            <Button
              fullWidth
              disabled={!weight || weight === 0}
              variant="filled"
              onClick={handleCalculate}
            >
              Calculate
            </Button>
          </Box>
        </Box>

        <Title order={3} mb="md" mt="md">
          Sets:
        </Title>
        <Box
          display="flex"
          sx={{
            flexWrap: "wrap",
            alignItems: "center",
            gap: 8,
            rowGap: 20,
            marginBottom: "10",
          }}
        >
          {calculated.sort().map((c) => (
            <Checkbox
              w="90px"
              size="lg"
              key={c}
              label={c % 1 === 0 ? c.toFixed(0) : c.toFixed(2)}
            />
          ))}
        </Box>
      </Box>
    </Container>
  )
}

export default App
