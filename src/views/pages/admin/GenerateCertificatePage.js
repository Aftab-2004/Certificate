import * as React from "react";
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import certif_7 from "assets/images/templates/certif_7.png";
import certif_8 from "assets/images/templates/certif_8.png";

// material-ui
import { useTheme } from "@mui/material/styles";

import {
    Stack,
    Box,
    ButtonGroup,
    Button,
    Checkbox,
    Divider,
    FormControl,
    FormControlLabel,
    FormHelperText,
    Grid,
    IconButton,
    InputAdornment,
    InputLabel,
    OutlinedInput,
    TextField,
    Typography,
    useMediaQuery,
    Select,
    MenuItem
} from '@mui/material';

import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";


import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";

// project imports
import { generateCertificatesAction, getAllEtudiantsAction, setEtudiantsAction } from "store/backOpsAction";
import { useRef } from "react";
import AuthCardWrapperForm from "../authentication/AuthCardWrapperForm";
import dayjs from "dayjs";
import { useState } from "react";
import { Formik } from "formik";
import { clearMessage } from "store/apiMessage";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import AnimateButton from "ui-component/extended/AnimateButton";
import { LoadingButton } from "@mui/lab";
import useScriptRef from "hooks/useScriptRef";
import Toast from "ui-component/ui-error/toast";


const EtudiantsPage = () => {
  const theme = useTheme();
  const matchDownSM = useMediaQuery(theme.breakpoints.down('md'));
  const customization = useSelector((state) => state.customization);
  const dispatch = useDispatch();
  const filiere = useSelector((state) => state.backops.filiere);
  const etudiantsInfos = useSelector((state) => state.backops.etudiants);
  const scriptedRef = useScriptRef();
//   const message = useSelector((state) => state.message.message);

console.log(etudiantsInfos);
    const [etudiants, setEtudiants] = useState({});
  const [loading, setloading] = useState(false);

  const [date, setDate] = useState(dayjs(new Date().toISOString()));

  const [template, setTemplate] = useState("certif_7");

  const [ministere, setMinistere] = useState("ministere_2");
  const [presidence, setPresidence] = useState("uca");
  const [etablissement, setEtablissement] = useState("fst");
  const [civilite, setCivilite] = useState(["0", "0"]);

  const handleChangeDate = (newDate) => {
    setDate(newDate)
};

const handleSetTemplate = (template) => {
    setTemplate(template);
}

const handleMinistereChange = (event) => {
    setMinistere(event.target.value);
  };

  const handlePresidenceChange = (event) => {
    setPresidence(event.target.value);
  };

  const handleEtablissementChange = (event) => {
    setEtablissement(event.target.value);
  };

  const handleFirstCiviliteChange = (event) => {
    console.log(event.target.value);
    setCivilite((civilite) => [event.target.value, civilite[1]]);
 };

 const handleSecondCiviliteChange = (event) => {
   setCivilite((civilite) => [civilite[0], event.target.value]);
};

  useEffect(() => {
    console.log("etudiantsInfos" + etudiantsInfos);
    console.log(etudiantsInfos);
    setEtudiants(etudiantsInfos);
  }, [etudiantsInfos]);

  return (
    <>
    {/* {message && <Toast message={JSON.parse(message)} severity="info" />} */}
      <Grid container spacing={3}>
        <Grid container justifyContent="center" alignItems="center">
          <Grid item sx={{ m: { xs: 1, sm: 3 }, mb: 0 }}>
            <AuthCardWrapperForm>
              <Grid
                container
                spacing={2}
                alignItems="center"
                justifyContent="center"
              >
                <Grid
                  container
                  direction={matchDownSM ? "column-reverse" : "row"}
                  alignItems="center"
                  justifyContent="center"
                >
                  <Grid item>
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                    >
                      <Typography
                        color={theme.palette.secondary.main}
                        gutterBottom
                        variant={matchDownSM ? "h3" : "h2"}
                        sx={{ p: 3 }}
                      >
                       Générer les certificats
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={12}>

              <Formik
                initialValues={{
                    students: [],
                    filiere: '',
                    signers: [],
                    positions: [],
                    date: '',
                    local: '',
                    titre_diplome: '',
                    ministere: '',
                    presidence: '',
                    etablissement: '',
                    template: '',
                }}
              
                onSubmit={async (values, { setErrors, setStatus, setSubmitting }) => {
                    try {
                        if (scriptedRef.current) {
                            dispatch(clearMessage())
                            values.date = date["$d"].toLocaleDateString('fr-FR');
                            values.filiere = filiere.abbr;
                            values.template = template ? template : "certif_7";
                            values.ministere = ministere ? ministere : values.ministere;
                            values.presidence = presidence ? presidence : values.presidence;
                            values.etablissement = etablissement ? etablissement : values.etablissement;
                            

                            let students = [];
                            let student = {};
                            console.log(etudiants);
                            etudiants.forEach((etudiant) => {
                                student = {
                                    fullName : etudiant.User.nom + ' ' + etudiant.User.prenom,
                                    cne: etudiant.cne,
                                    cin: etudiant.User.cin,
                                    mention: "Bien",
                                    annee_univ: "2022-2023",
                                }
                                students.push(student);
                            });

                            console.log(students);

                            let signers = [];
                            let signer = {};
                            values.signers.forEach((signer, index) => {
                                let signerCivilite = civilite[index] == "0" ? "M." : "Mme.";
                                signer = {
                                    fullname : signerCivilite + " " +signer,
                                    position: values.positions[index],
                                }
                                signers.push(signer);
                            });

                            console.log(signers);

                            console.log(students);
                            let data = {
                                students: students,
                                filiere: values.filiere,
                                signers: signers,
                                date: values.date,
                                local: values.local,
                                titre_diplome: values.titre_diplome,
                                ministere: values.ministere,
                                presidence: values.presidence,
                                etablissement: values.etablissement,
                                template: values.template,
                            }

                            if (values.etablissement != "") { 
                                data["etablissement"] = values.etablissement;
                            }

                            console.log(data)
                            setloading(true);
                            dispatch(generateCertificatesAction(data)).
                                then((res) => {
                                    setloading(false);
                                    setStatus({ success: true });
                                }).catch((err) => {
                                    setloading(false);
                                    setStatus({ success: false });
                                })
                        }
                    } catch (err) {
                        console.error(err);
                        if (scriptedRef.current) {
                            setStatus({ success: false });
                            setErrors({ submit: err.message });
                        }
                    }
                }}
                >
                    {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values }) => (
                    <form noValidate onSubmit={handleSubmit}>                    
                        <Grid container spacing={matchDownSM ? 0 : 2}>
                        <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Titre du diplôme"
                                    margin="normal"
                                    name="titre_diplome"
                                    type="text"
                                    value={values.titre_diplome}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* <TextField
                                    fullWidth
                                    label="Ministere"
                                    margin="normal"
                                    name="ministere"
                                    value={values.ministere}
                                    type="text"
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                /> */}


                                <FormControl style={{marginTop: "8px"}} margin="normal" fullWidth>
                                    <InputLabel id="ministere">Ministere</InputLabel>
                                    <Select
                                        labelId="ministere"
                                        id="ministere"
                                        value={ministere}
                                        label="Ministere"
                                        onChange={handleMinistereChange}
                                        style={{height: "61px"}}
                                    >
                                        <MenuItem value={"ministere_2"}>Ministere</MenuItem>
                                    </Select>
                                </FormControl>

                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {/* <TextField
                                    fullWidth
                                    label="Présidence"
                                    margin="normal"
                                    name="presidence"
                                    type="text"
                                    value={values.presidence}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ ...theme.typography.customInput }}
                                /> */}

                                <FormControl style={{marginTop: "8px"}} margin="normal" fullWidth>
                                    <InputLabel id="presidence">Présidence</InputLabel>
                                    <Select
                                        labelId="presidence"
                                        id="presidence"
                                        value={presidence}
                                        label="Présidence"
                                        onChange={handlePresidenceChange}
                                        style={{height: "61px"}}
                                    >
                                        <MenuItem value={"uca"}>UCA</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <FormControl style={{marginTop: "8px"}} margin="normal" fullWidth>
                                    <InputLabel id="etablissement">Etablissement</InputLabel>
                                    <Select
                                        labelId="etablissement"
                                        id="etablissement"
                                        value={etablissement}
                                        label="Etablissement"
                                        onChange={handleEtablissementChange}
                                        style={{height: "61px"}}
                                    >
                                        <MenuItem value={"fst"}>FSTG</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>

                                    <DesktopDatePicker
                                        label="Date"
                                        inputFormat="MM/DD/YYYY"
                                        name="date"
                                        value={date}
                                        onChange={handleChangeDate}
                                        renderInput={(params) => <TextField fullWidth  {...params} sx={{ ...theme.typography.customInput }} />}

                                    />
                                </LocalizationProvider>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Local"
                                    margin="normal"
                                    name="local"
                                    value={values.local}
                                    type="text"
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            cursor: 'unset',
                                            m: 2,
                                            py: 0.5,
                                            px: 7,
                                            borderColor: `${theme.palette.grey[100]} !important`,
                                            color: `${theme.palette.grey[700]}!important`,
                                            fontWeight: 500,
                                            borderRadius: `${customization.borderRadius}px`
                                        }}
                                        disableRipple
                                        disabled
                                    >
                                        Signataires
                                    </Button>
                                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                </Box>
                            </Grid>
                            
                            <Grid item xs={3} sm={3} md={2}>
                                <FormControl style={{marginTop: "8px"}} margin="normal" fullWidth>
                                    <InputLabel id="civilite0">Civilité</InputLabel>
                                    <Select
                                        labelId="civilite0"
                                        id="civilite0"
                                        value={civilite[0]}
                                        label="Civilité"
                                        onChange={handleFirstCiviliteChange}
                                        style={{height: "61px"}}
                                    >
                                        <MenuItem value={"0"}>Homme</MenuItem>
                                        <MenuItem value={"1"}>Femme</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={9} sm={9} md={4}>
                                <TextField
                                    fullWidth
                                    label="Nom Complet"
                                    margin="normal"
                                    name="signers[0]"
                                    type="text"
                                    value={values.signers[0]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Position"
                                    margin="normal"
                                    name="positions[0]"
                                    type="text"
                                    value={values.positions[0]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid>
                            
                            
                            <Grid item xs={3} sm={3} md={2}>
                                <FormControl style={{marginTop: "8px"}} margin="normal" fullWidth>
                                    <InputLabel id="civilite1">Civilité</InputLabel>
                                    <Select
                                        labelId="civilite1"
                                        id="civilite1"
                                        value={civilite[1]}
                                        label="Civilité"
                                        onChange={handleSecondCiviliteChange}
                                        style={{height: "61px"}}
                                    >
                                        <MenuItem value={"0"}>Homme</MenuItem>
                                        <MenuItem value={"1"}>Femme</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>
                            <Grid item xs={9} sm={9} md={4}>
                                <TextField
                                    fullWidth
                                    label="Nom Complet"
                                    margin="normal"
                                    name="signers[1]"
                                    type="text"
                                    value={values.signers[1]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ ...theme.typography.customInput }}
                                    disabled={values.signers[0] == "" || values.signers[0] == null || values.positions[0] == "" || values.positions[0] == null}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    fullWidth
                                    label="Position"
                                    margin="normal"
                                    name="positions[1]"
                                    type="text"
                                    value={values.positions[1]}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    sx={{ ...theme.typography.customInput }}
                                    disabled={values.signers[0] == "" || values.signers[0] == null || values.positions[0] == "" || values.positions[0] == null}
                                />
                            </Grid>
                            
                            <Grid item xs={12}>
                                <Box sx={{ alignItems: 'center', display: 'flex' }}>
                                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                    <Button
                                        variant="outlined"
                                        sx={{
                                            cursor: 'unset',
                                            m: 2,
                                            py: 0.5,
                                            px: 7,
                                            borderColor: `${theme.palette.grey[100]} !important`,
                                            color: `${theme.palette.grey[700]}!important`,
                                            fontWeight: 500,
                                            borderRadius: `${customization.borderRadius}px`
                                        }}
                                        disableRipple
                                        disabled
                                    >
                                        Template
                                    </Button>
                                    <Divider sx={{ flexGrow: 1 }} orientation="horizontal" />
                                </Box>
                            </Grid>
{/* 
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    label="Template"
                                    margin="normal"
                                    name="template"
                                    value={values.template}
                                    type="text"
                                    onChange={handleChange}
                                    sx={{ ...theme.typography.customInput }}
                                />
                            </Grid> */}

                            <Grid item xs={12} sm={12} md={6} lg={6} container justifyContent={"center"}>
                                <Button variant="outlined" color={`${template == "certif_7" ? "success" : "primary"}`} onClick={() => handleSetTemplate("certif_7")}>
                                <img src={certif_7} alt="certif_7" width={300} />
                                </Button>
                            </Grid>
                            <Grid item xs={12} sm={12} md={6} lg={6} container justifyContent={"center"}>
                                <Button variant="outlined" color={`${template == "certif_8" ? "success" : "primary"}`} onClick={() => handleSetTemplate("certif_8")}>
                                <img src={certif_8} alt="certif_8" width={300} />
                                </Button>
                            </Grid>

                        </Grid>

                        
                        {errors.submit && (
                        <Box sx={{ mt: 3 }}>
                            <FormHelperText error>{errors.submit}</FormHelperText>
                        </Box>
                    )}

                    <Box sx={{ mt: 5 }}>
                        <AnimateButton>
                            <LoadingButton
                                disableElevation
                                loading={loading}
                                disabled={loading}
                                fullWidth
                                size="large"
                                type="submit"
                                variant="contained"
                                color="secondary"
                            >
                                Générer
                            </LoadingButton>
                        </AnimateButton>
                    </Box>
                </form>
                    )}
            </Formik>









              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </AuthCardWrapperForm>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default EtudiantsPage;
