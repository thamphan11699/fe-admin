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
import { getAll } from '../category/CategoryService'
import { getAll as getColours } from '../Color/ColorService'
import { getAll as getContextProvider } from '../context-provider/ContextProviderService'
import { getAll as getWareHouse } from '../ware-house/WareHouseService'
import { getParent, save, update } from './ProductService'
const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}))

const ProductDialog = ({ item, open, handleClose }) => {
  const [product, setProduct] = useState({
    id: null,
    name: '',
    code: '',
    title: '',
    description: '',
    parent: null,
    thumbnail: '',
    color: null,
    size: '',
    quantity: 0,
    categories: [],
    images: [],
    wareHouse: null,
    contextProvider: null,
    price: 0,
  })

  const classes = useStyles()

  const [files, setFiles] = useState([])

  const [listParent, setListParent] = useState([])

  const [listCategory, setListCategory] = useState([])

  const [listColor, setListColor] = useState([])

  const [listWareHouse, setListWareHouse] = useState([])

  const [listContext, setListContext] = useState([])

  useEffect(() => {
    if (item.id) {
      setProduct(item)
    }
  }, [item])

  useEffect(() => {
    if (open) {
      getParent({ pageIndex: 1, pageSize: 10000 }).then(({ data }) => {
        setListParent(data)
      })
      getAll({ pageIndex: 1, pageSize: 10000 }).then(({ data }) => {
        setListCategory(data.content)
      })
      getColours({ pageIndex: 1, pageSize: 10000 }).then(({ data }) => {
        setListColor(data.content)
      })
      getWareHouse({ pageIndex: 1, pageSize: 10000 }).then(({ data }) => {
        setListWareHouse(data.content)
      })
      getContextProvider({ pageIndex: 1, pageSize: 10000 }).then(({ data }) => {
        setListContext(data.content)
      })
    }
  }, [open])

  const handleChange = (event) => {
    setProduct({ ...product, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (files.length > 0) {
      const url = 'http://127.0.0.1:8089/api/upload-file'
      const config = {
        headers: {
          'content-type': 'multipart/form-data; boundary=<calculated when request is sent>',
        },
      }
      const formData = new FormData()
      formData.append('file', files[0])
      const response = await axios.post(url, formData, config)
      setProduct({ ...product, thumbnail: response.data })
      if (product.id) {
        update({ ...product, thumbnail: response.data }, product.id)
          .then(({ data }) => {
            toast.success(`C???p nh???t th??nh c??ng`)
            handleCloseDialog()
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        save({ ...product, thumbnail: response.data })
          .then(({ data }) => {
            if (data.id == null) {
              toast.warning('S???n ph???m ???? t???n t???i')
              return
            }
            toast.success(`Th??m m???i th??nh c??ng`)
            handleCloseDialog()
          })
          .catch((err) => {
            console.log(err)
          })
      }
    } else {
      if (product.id) {
        update(product, product.id)
          .then(({ data }) => {
            toast.success(`C???p nh???t th??nh c??ng`)
            handleCloseDialog()
          })
          .catch((err) => {
            console.log(err)
          })
      } else {
        save(product)
          .then(({ data }) => {
            if (data.id == null) {
              toast.warning('S???n ph???m ???? t???n t???i')
              return
            }
            toast.success(`Th??m m???i th??nh c??ng`)
            handleCloseDialog()
          })
          .catch((err) => {
            console.log(err)
          })
      }
    }
  }

  const handleChangeParent = (event, newParent) => {
    setProduct({ ...product, parent: newParent, categories: [] })
  }

  const handleChangeCategory = (event, categories) => {
    setProduct({ ...product, categories })
  }

  const uploadFile = (files) => {
    setFiles(files)
  }

  const handleCloseDialog = () => {
    setProduct({
      id: null,
      name: '',
      code: '',
      title: '',
      description: '',
      parent: null,
      thumbnail: '',
      color: null,
      size: '',
      quantity: 0,
      categories: [],
      images: [],
      wareHouse: null,
      contextProvider: null,
      price: 0,
    })
    handleClose()
  }

  const listSize = [
    { name: 'Size S', value: 'S' },
    { name: 'Size M', value: 'M' },
    { name: 'Size L', value: 'L' },
    { name: 'Size XL', value: 'XL' },
    { name: 'Size XXL', value: 'XXL' },
    { name: 'Free Size', value: 'F' },
  ]

  const handleChangeSize = (event, size) => {
    setProduct({ ...product, size: size.value })
  }

  const handleChangeColor = (event, colour) => {
    setProduct({ ...product, color: colour })
  }

  const handleChangeWareHose = (event, option) => {
    setProduct({ ...product, wareHouse: option })
  }

  const handleChangeContext = (event, option) => {
    setProduct({ ...product, contextProvider: option })
  }

  return (
    <div>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title" maxWidth="md">
        <DialogTitle id="form-dialog-title" style={{ background: '#757ce8', color: 'white' }}>
          {product.id ? 'Edit Product' : 'Create Product'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {listParent != null && listParent.length > 0 && (
              <Grid item md={6} xs={12}>
                <Autocomplete
                  disabled={product.id ? true : false}
                  value={product.parent ? product.parent : null}
                  onChange={(event, option) => {
                    handleChangeParent(event, option)
                  }}
                  defaultValue={listParent[0]}
                  getOptionLabel={(option) => option.name}
                  id="controllable-states-demo"
                  options={listParent}
                  margin="dense"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="S???n ph???m cha"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}
            {listCategory != null && listCategory.length > 0 && product.parent == null && (
              <Grid item md={6} xs={12}>
                <Autocomplete
                  disabled={product.parent ? true : false}
                  value={product.categories ? product.categories : null}
                  onChange={(event, option) => {
                    handleChangeCategory(event, option)
                  }}
                  defaultValue={listCategory[0]}
                  getOptionLabel={(option) => option.name}
                  multiple
                  id="controllable-states-demo"
                  options={listCategory}
                  margin="dense"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Danh m???c s???n ph???m"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}
            {listWareHouse != null && listWareHouse.length > 0 && product.parent == null && (
              <Grid item md={6} xs={12}>
                <Autocomplete
                  disabled={product.parent ? true : false}
                  value={product.wareHouse ? product.wareHouse : null}
                  onChange={(event, option) => {
                    handleChangeWareHose(event, option)
                  }}
                  defaultValue={listWareHouse[0]}
                  getOptionLabel={(option) => option.name}
                  id="controllable-states-demo"
                  options={listWareHouse}
                  margin="dense"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Kho ch???a"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}
            {listContext != null && listContext.length > 0 && product.parent == null && (
              <Grid item md={6} xs={12}>
                <Autocomplete
                  disabled={product.parent ? true : false}
                  value={product.contextProvider ? product.contextProvider : null}
                  onChange={(event, option) => {
                    handleChangeContext(event, option)
                  }}
                  defaultValue={listContext[0]}
                  getOptionLabel={(option) => option.name}
                  id="controllable-states-demo"
                  options={listContext}
                  margin="dense"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Nh?? cung c???p"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}
            {listSize != null && listSize.length > 0 && product.parent && (
              <Grid item md={6} xs={12}>
                <Autocomplete
                  value={product.size ? listSize.find((item) => item.value === product.size) : null}
                  onChange={(event, option) => {
                    handleChangeSize(event, option)
                  }}
                  defaultValue={listSize[0]}
                  getOptionLabel={(option) => option.name}
                  id="controllable-states-demo"
                  options={listSize}
                  margin="dense"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Size"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}
            {listColor != null && listColor.length > 0 && product.parent && (
              <Grid item md={6} xs={12}>
                <Autocomplete
                  value={product.color ? product.color : null}
                  onChange={(event, option) => {
                    handleChangeColor(event, option)
                  }}
                  defaultValue={listColor[0]}
                  getOptionLabel={(option) => option.name}
                  id="controllable-states-demo"
                  options={listColor}
                  margin="dense"
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="M??u s???c"
                      variant="outlined"
                      margin="dense"
                      fullWidth
                    />
                  )}
                />
              </Grid>
            )}

            {product.parent != null && (
              <Grid item md={6} xs={12}>
                <TextField
                  margin="dense"
                  id="quantity"
                  label="S??? l?????ng"
                  type="number"
                  fullWidth
                  name="quantity"
                  variant="outlined"
                  value={product.quantity ? product.quantity : ''}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {product.parent != null && (
              <Grid item md={6} xs={12}>
                <TextField
                  margin="dense"
                  id="priceInput"
                  label="Gi?? nh???p v??o"
                  type="number"
                  fullWidth
                  name="priceInput"
                  variant="outlined"
                  value={product.priceInput ? product.priceInput : ''}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {product.parent != null && (
              <Grid item md={6} xs={12}>
                <TextField
                  margin="dense"
                  id="peice"
                  label="Gi??"
                  type="number"
                  fullWidth
                  name="price"
                  variant="outlined"
                  value={product.price ? product.price : ''}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {product.parent == null && (
              <Grid item md={6} xs={12}>
                <TextField
                  margin="dense"
                  id="name"
                  label="T??n s???n ph???m"
                  type="text"
                  fullWidth
                  name="name"
                  variant="outlined"
                  value={product.name ? product.name : ''}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {product.parent == null && (
              <Grid item md={6} xs={12}>
                <TextField
                  margin="dense"
                  id="code"
                  label="M?? s???n ph???m"
                  type="text"
                  fullWidth
                  name="code"
                  variant="outlined"
                  value={product.code ? product.code : ''}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {product.parent == null && (
              <Grid item md={6} xs={12}>
                <TextField
                  margin="dense"
                  id="title"
                  label="Ti??u ????? s???n ph???m"
                  type="text"
                  fullWidth
                  name="title"
                  variant="outlined"
                  value={product.title ? product.title : ''}
                  onChange={handleChange}
                />
              </Grid>
            )}
            {product.parent == null && (
              <Grid item md={6} xs={12}>
                <TextField
                  margin="dense"
                  id="description"
                  label="M?? t???"
                  type="text"
                  fullWidth
                  name="description"
                  variant="outlined"
                  minRows={1}
                  maxRows={5}
                  multiline
                  value={product.description ? product.description : ''}
                  onChange={handleChange}
                />
              </Grid>
            )}
          </Grid>
          <Grid container spacing={3}>
            <Grid item md={6} xs={12}>
              <DropzoneArea
                onChange={(files) => uploadFile(files)}
                filesLimit={5}
                acceptedFiles={['image/*']}
                dropzoneText={product.id ? 'Ch???nh s???a h??nh ???nh' : 'Th??m h??nh ???nh'}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.media}
                  style={{}}
                  image={product.id ? product.thumbnail : ''}
                  title={product.title}
                />
              </Card>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions style={{ marginRight: 12 }}>
          <Button onClick={handleCloseDialog} color="secondary" variant="contained">
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

ProductDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
}
export default ProductDialog
