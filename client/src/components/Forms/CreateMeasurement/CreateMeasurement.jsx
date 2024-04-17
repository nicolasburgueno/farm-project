import {
  Box,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Wrap,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Flex,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  FormHelperText,
  FormErrorMessage,
} from '@chakra-ui/react';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const CreateMeasurement = () => {
  const params = useParams();
  const [attributes, setAttributes] = useState([]);
  const [errors, setErrors] = useState({});
  const [data, setData] = useState({
    cowName: '',
    penVariableId: 0,
    value: '',
  });
  const [values, setValues] = useState([]);
  const handleChange = (value, name, granularity) => {
    setValues([...values, { [name]: value }]);
    validationNumber(value, name, granularity);
  };

  const validationNumber = (value, name, granularity) => {
    console.log(value % granularity !== 0);
    if (Number(value) % granularity !== 0) {
      console.log('entre');
      setErrors({
        ...errors,
        [name]: {
          message: 'El numero ingresado debe respetar la granularidad',
        },
      });
      console.log(errors);
    } else {
      if (errors[name]) {
        let newErrors = { ...errors };
        delete newErrors[name];
        setErrors(newErrors);
      }
    }
  };
  const validationEnum = (value) => {};
  // let arr = [];
  console.log(values);
  // console.log(
  //   'valores array',
  //   Object.values(values).map((e) => arr.push(e))
  // );
  // console.log('arr:', arr);
  //nombre de la vaca o id(opcional)
  useEffect(() => {
    let defaultValues = {};
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}/penVariable/${params.id}`)
      .then((response) => {
        response.data.forEach((prop) => {
          defaultValues[prop.variable.name] = '';
        });
        setAttributes(response.data);
        setValues([defaultValues]);
      })
      .catch((error) => console.log(error));
  }, [params.id]);
  const onSubmit = () => {
    console.log(data);
  };

  return (
    <div>
      <h1>measurement</h1>
      <FormControl mb={2}>
        <FormLabel>Nombre de medicion:</FormLabel>
        <Input
          type="enum"
          id="name"
          name="name"
          autoFocus={true}
          required
          focusBorderColor="#1a1a1a"
          placeholder="Toro Dorado"
        />
      </FormControl>
      {attributes.map((prop, i) => (
        <Box key={i} mb={4}>
          {prop.variable.type == 'number' && (
            <FormControl isInvalid={!!errors[prop.variable.name]}>
              <FormLabel>{prop.variable.name}:</FormLabel>
              <Flex>
                <NumberInput
                  type="number"
                  maxW="100px"
                  mr="2rem"
                  defaultValue={prop.custom_parameters.value.min}
                  name={prop.variable.name}
                  value={
                    values[prop.variable.name]
                      ? values[prop.variable.name]
                      : prop.custom_parameters.value.min
                  }
                  onChange={(value) =>
                    handleChange(
                      parseFloat(value)
                        ? parseFloat(value)
                        : prop.custom_parameters.value.min,
                      prop.variable.name,
                      prop.custom_parameters.granularity
                    )
                  }
                  step={prop.custom_parameters.granularity}
                  min={prop.custom_parameters.value.min}
                  max={prop.custom_parameters.value.max}
                >
                  <NumberInputField />
                  <NumberInputStepper
                    keepWithinRange={true}
                    step={prop.custom_parameters.granularity}
                  >
                    <NumberIncrementStepper />
                    <NumberDecrementStepper />
                  </NumberInputStepper>
                </NumberInput>
                <Slider
                  flex="1"
                  defaultValue={prop.custom_parameters.value.min}
                  focusThumbOnChange={false}
                  value={values[prop.variable.name]}
                  onChange={(value) =>
                    handleChange(
                      value,
                      prop.variable.name,
                      prop.custom_parameters.granularity
                    )
                  }
                  step={prop.custom_parameters.granularity}
                  min={prop.custom_parameters.value.min}
                  max={prop.custom_parameters.value.max}
                >
                  <SliderTrack>
                    <SliderFilledTrack />
                  </SliderTrack>
                  <SliderThumb fontSize="sm" boxSize="32px" />
                </Slider>
              </Flex>
              <Wrap>
                <FormHelperText mr={10}>
                  Granularidad: {prop.custom_parameters.granularity}
                </FormHelperText>
                <FormErrorMessage
                  fontWeight={'bold'}
                  textShadow={'0.4px 0.4px black'}
                >
                  {errors[prop.variable.name]?.message.toUpperCase()}
                </FormErrorMessage>
              </Wrap>
            </FormControl>
          )}
          {prop.variable.type == 'enum' && (
            <FormControl>
              <FormLabel>{prop.variable.name}:</FormLabel>
              <RadioGroup
                defaultValue=""
                onChange={(value) => handleChange(value, prop.variable.name)}
              >
                <HStack spacing="1rem">
                  <Wrap>
                    {prop.custom_parameters.value.map((v, i) => (
                      <Radio key={i} value={v}>
                        {v}
                      </Radio>
                    ))}
                  </Wrap>
                </HStack>
              </RadioGroup>
            </FormControl>
          )}
          {prop.variable.type == 'bolean' && (
            <FormControl>
              <FormLabel>{prop.variable.name}:</FormLabel>
              <RadioGroup
                defaultValue=""
                onChange={(value) => handleChange(value, prop.variable.name)}
              >
                <HStack spacing="1rem">
                  <Wrap>
                    <Radio value="true">Verdadero</Radio>
                    <Radio value="false">Falso</Radio>
                  </Wrap>
                </HStack>
              </RadioGroup>
            </FormControl>
          )}
        </Box>
      ))}
      <button onClick={onSubmit} className="btn btn-primary btn-sm">
        Crear corral
      </button>
    </div>
  );
};

export default CreateMeasurement;
