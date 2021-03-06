import {
  Button,
  Card,
  CardMedia,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  TextField,
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import Autocomplete from '@material-ui/lab/Autocomplete'
import axios from 'axios'
import { DropzoneArea } from 'material-ui-dropzone'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { getParent, save, update } from './CategoryService'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}))

const CategoryDialog = ({ item, open, handleClose }) => {
  const [category, setCategory] = useState({
    id: null,
    name: '',
    code: '',
    description: '',
    parent: null,
    thumbnail: '',
  })

  const classes = useStyles()

  const [files, setFiles] = useState([])

  const [listParent, setListParent] = useState([])

  useEffect(() => {
    setCategory(item)
  }, [item])

  useEffect(() => {
    if (open) {
      getParent({ pageIndex: 1, pageSize: 10000 }).then(({ data }) => {
        setListParent(data)
      })
    }
  }, [open])

  const handleChange = (event) => {
    setCategory({ ...category, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    try {
      if (files.length > 0) {
        const url = 'http://localhost:8089/api/upload-file'
        const formData = new FormData()
        formData.append('file', files[0])
        const config = {
          headers: {
            'content-type': 'multipart/form-data',
          },
        }
        axios
          .post(url, formData, config)
          .then(({ data }) => {
            setCategory({ ...category, thumbnail: data })
            if (category.id) {
              update({ ...category, thumbnail: data }, category.id)
                .then(({ data }) => {
                  toast.success(`C???p nh???t th??nh c??ng`)
                  handleClose()
                })
                .catch((err) => {
                  console.log(err)
                  toast.error('C???p nh???t th???t b???i')
                })
            } else {
              save({ ...category, thumbnail: data }, category.id)
                .then(({ data }) => {
                  toast.success(`Th??m m???i th??nh c??ng`)
                  handleClose()
                })
                .catch((err) => {
                  console.log(err)
                  toast.error('Th??m m???i th???t b???i')
                })
            }
          })
          .catch((err) => {
            toast.error('C?? l???i s???y ra trong khi l??u. H??y th??? l???i sau')
            return
          })
        setCategory({})
      } else {
        if (category.id) {
          update(category, category.id)
            .then(({ data }) => {
              toast.success(`C???p nh???t th??nh c??ng`)
              handleClose()
            })
            .catch((err) => {
              console.log(err)
              toast.error('C???p nh???t th???t b???i')
            })
        } else {
          save(category, category.id)
            .then(({ data }) => {
              toast.success(`Th??m m???i th??nh c??ng`)
              handleClose()
            })
            .catch((err) => {
              console.log(err)
              toast.error('Th??m m???i th???t b???i')
            })
        }
      }
      setCategory({})
    } catch (error) {
      console.log(error)
      toast.error('C?? l???i s???y ra trong khi l??u. H??y th??? l???i sau')
      return
    }
  }

  const handleChangeParent = (event, newParent) => {
    setCategory({ ...category, parent: newParent })
  }

  const uploadFile = (files) => {
    setFiles(files)
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="form-dialog-title" style={{ background: '#757ce8', color: 'white' }}>
          {category.id ? 'Ch???nh s???a danh m???c' : 'Th??m m???i danh m???c'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <Autocomplete
                disabled={category.id ? true : false}
                value={category.parent ? category.parent : null}
                onChange={(event, option) => {
                  handleChangeParent(event, option)
                }}
                defaultValue={listParent.length > 0 ? listParent[0] : null}
                getOptionLabel={(option) => option.name}
                id="controllable-states-demo"
                options={listParent}
                margin="dense"
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Danh m???c cha"
                    variant="outlined"
                    margin="dense"
                    fullWidth
                  />
                )}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="name"
                label="T??n danh m???c"
                type="text"
                fullWidth
                name="name"
                variant="outlined"
                value={category.name ? category.name : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="code"
                label="M?? danh m???c"
                type="text"
                fullWidth
                name="code"
                variant="outlined"
                value={category.code ? category.code : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <TextField
                margin="dense"
                id="description"
                label="M?? t???"
                type="text"
                fullWidth
                name="description"
                variant="outlined"
                value={category.description ? category.description : ''}
                onChange={handleChange}
              />
            </Grid>
            {category.parent == null && (
              <>
                <Grid item md={6} xs={12}>
                  <Card className={classes.root}>
                    <CardMedia
                      className={classes.media}
                      style={{}}
                      image={category.id ? category.thumbnail : ''}
                      title={category.title}
                    />
                  </Card>
                </Grid>
                <Grid item md={6} xs={12}>
                  <DropzoneArea
                    onChange={(files) => uploadFile(files)}
                    filesLimit={1}
                    acceptedFiles={['image/*']}
                    dropzoneText={category.id ? 'S???a h??nh ???nh' : 'Th??m h??nh ???nh'}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions style={{ marginRight: 12 }}>
          <Button onClick={handleClose} color="secondary" variant="contained">
            H???y
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            L??u
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

CategoryDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
}
export default CategoryDialog
