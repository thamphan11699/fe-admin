import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
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
import { getParent, save, update } from './CategoryService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { DropzoneArea } from 'material-ui-dropzone'
import axios from 'axios'

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
                  toast.success(`Cập nhật thành công`)
                  handleClose()
                })
                .catch((err) => {
                  console.log(err)
                  toast.error('Cập nhật thất bại')
                })
            } else {
              save({ ...category, thumbnail: data }, category.id)
                .then(({ data }) => {
                  toast.success(`Thêm mới thành công`)
                  handleClose()
                })
                .catch((err) => {
                  console.log(err)
                  toast.error('Thêm mới thất bại')
                })
            }
          })
          .catch((err) => {
            toast.error('Có lỗi sảy ra trong khi lưu. Hãy thử lại sau')
            return
          })
        setCategory({})
      } else {
        if (category.id) {
          update(category, category.id)
            .then(({ data }) => {
              toast.success(`Cập nhật thành công`)
              handleClose()
            })
            .catch((err) => {
              console.log(err)
              toast.error('Cập nhật thất bại')
            })
        } else {
          save(category, category.id)
            .then(({ data }) => {
              toast.success(`Thêm mới thành công`)
              handleClose()
            })
            .catch((err) => {
              console.log(err)
              toast.error('Thêm mới thất bại')
            })
        }
      }
      setCategory({})
    } catch (error) {
      console.log(error)
      toast.error('Có lỗi sảy ra trong khi lưu. Hãy thử lại sau')
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
        <DialogTitle id="form-dialog-title">
          {category.id ? 'Chỉnh sửa danh mục' : 'Thêm mới danh mục'}
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
                    label="Danh mục cha"
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
                label="Tên danh mục"
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
                label="Mã danh mục"
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
                label="Mô tả"
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
                      image={
                        category.id
                          ? category.thumbnail
                          : 'https://cdn.pixabay.com/photo/2018/10/23/08/18/sexy-girl-3767276__340.jpg'
                      }
                      title={category.title}
                    />
                  </Card>
                </Grid>
                <Grid item md={6} xs={12}>
                  <DropzoneArea
                    onChange={(files) => uploadFile(files)}
                    filesLimit={1}
                    acceptedFiles={['image/*']}
                    dropzoneText={category.id ? 'Sửa hình ảnh' : 'Thêm hình ảnh'}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </DialogContent>
        <DialogActions style={{ marginRight: 12 }}>
          <Button onClick={handleClose} color="secondary" variant="contained">
            Hủy
          </Button>
          <Button onClick={handleSubmit} color="primary" variant="contained">
            Lưu
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
