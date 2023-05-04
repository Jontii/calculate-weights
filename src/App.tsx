import { Box, Button, Checkbox, Container, Grid, NumberInput, Space, Title } from "@mantine/core"
import { useState } from "react"
import "./App.css"
import { useLocalStorage } from "./useLocalStorage"

const App = () => {
  const [previousWeight, setPreviousWeight] = useLocalStorage<number | "">(`weight`, "")
  const [previousPercentage, setPreviousPercentage] = useLocalStorage<number | "">(
    `percentage`,
    100
  )
  const [previousCalculated, setPreviousCalculated] = useLocalStorage<number[] | undefined>(
    `calculated`,
    []
  )
  const [previouslySelected, setPreviouslySelected] = useLocalStorage<number[]>(
    `selected`,
    []
  )
  const [weight, setWeight] = useState<number | "">()
  const [percent, setPercent] = useState<number | "">(100)

  const [selected, setSelected] = useState<number[]>([])
  const [calculated, setCalculated] = useState<number[]>([])

  const handleCalculate = () => {
    const finalPercent = (percent || 0) * 0.01
    const finalWeight = isNaN(weight || 0)
      ? (weight as number) * finalPercent
      : parseInt(weight?.toString() || "0") * finalPercent

    const calculatedTemp = selected.map((s) => s * 0.01 * finalWeight)
    setCalculated(calculatedTemp)
    setPreviousCalculated(calculatedTemp)
  }

  const handleSetSelected = (value: number) => {
    if (selected.includes(value)) {
      setSelected(selected.filter((v) => v !== value))
      setPreviouslySelected(selected.filter((v) => v !== value))
      return
    }
    setSelected((oldValues) => [...new Set([...oldValues, value])])
    setPreviouslySelected([...new Set([...selected, value])])
  }

  const handleReusePreviousValues = () => {
    setCalculated(previousCalculated || [])
    setSelected(previouslySelected || [])
    setPercent(previousPercentage || 100)
    setWeight(previousWeight)
  }

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
            onChange={(value) => {
              setWeight(value)
              setPreviousWeight(value)
            }}
            precision={2}
            step={5}
            min={0}
            value={weight}
            type="number"
            size="xl"
          />
          <Space h="md" />

          <Title order={1} pb="sm">
            % of weight
          </Title>
          <NumberInput
            variant="default"
            min={0}
            value={percent}
            placeholder="95%"
            onChange={(value) => {
              setPercent(value)
              setPreviousPercentage(value)
            }}
            step={5}
            size="xl"
            type="number"
          />
        </Box>
        <Space h="md" />
        <Box>
          <Grid gutter={"sm"}>
            {[45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100, 105, 110, 115, 120].map((value) => (
              <Grid.Col span={3} key={value}>
                <Button
                  variant={selected.find((v) => v === value) ? "filled" : "light"}
                  onClick={() => handleSetSelected(value)}
                >
                  {value}%
                </Button>
              </Grid.Col>
            ))}
          </Grid>
          <Box mt="xl" w="100%" display="flex" sx={{ gap: 10 }}>
            <Button
              w="49%"
              disabled={previousWeight === undefined || previousCalculated === undefined}
              variant="filled"
              onClick={handleReusePreviousValues}
            >
              Previous values
            </Button>
            <Button
              w="49%"
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
