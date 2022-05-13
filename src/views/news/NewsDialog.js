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
import { CKEditor } from '@ckeditor/ckeditor5-react'
import ClassicEditor from '@ckeditor/ckeditor5-build-classic'
import { makeStyles } from '@material-ui/core/styles'
import axios from 'axios'
import { DropzoneArea } from 'material-ui-dropzone'
import PropTypes from 'prop-types'
import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { save, update } from './NewsService'

const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: '100%',
  },
  media: {
    height: 0,
    paddingTop: '56.25%', // 16:9
  },
}))

const NewsDialog = ({ item, open, handleClose }) => {
  const [news, setNews] = useState({
    id: null,
    title: '',
    content: '',
    thumbnail: '',
  })

  const classes = useStyles()

  const [files, setFiles] = useState([])

  useEffect(() => {
    console.log(item)
    if (item.id) {
      setNews(item)
    } else {
      setNews(null)
    }
  }, [item])

  const handleChange = (event) => {
    setNews({ ...news, [event.target.name]: event.target.value })
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
            setNews({ ...news, thumbnail: data })
            if (news.id) {
              update({ ...news, thumbnail: data }, news.id)
                .then(({ data }) => {
                  toast.success(`Update successfuly!`)
                  handleClose()
                })
                .catch((err) => {
                  console.log(err)
                  toast.error('Update fail')
                })
            } else {
              save({ ...news, thumbnail: data }, news.id)
                .then(({ data }) => {
                  toast.success(`Create successfuly!`)
                  handleClose()
                })
                .catch((err) => {
                  console.log(err)
                  toast.error('Create fail')
                })
            }
          })
          .catch((err) => {
            toast.error('Fail to uplaod file')
            return
          })
        setNews({})
      } else {
        if (news.id) {
          update(news, news.id)
            .then(({ data }) => {
              toast.success(`Update successfuly!`)
              handleClose()
            })
            .catch((err) => {
              console.log(err)
              toast.error('Update fail')
            })
        } else {
          save(news, news.id)
            .then(({ data }) => {
              toast.success(`Create successfuly!`)
              handleClose()
            })
            .catch((err) => {
              console.log(err)
              toast.error('Create fail')
            })
        }
        setNews({})
      }
      setNews({})
    } catch (error) {
      console.log(error)
      toast.error('Save fail')
      return
    }
  }

  const uploadFile = (files) => {
    setFiles(files)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
        maxWidth="md"
        fullWidth
      >
        <DialogTitle id="form-dialog-title">
          {news != null && news.id ? 'Chỉnh sửa' : 'Thêm mới'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item md={12} xs={12}>
              <TextField
                margin="dense"
                id="name"
                label="Tiêu đề"
                type="text"
                fullWidth
                name="title"
                variant="outlined"
                value={news != null && news.title ? news.title : ''}
                onChange={handleChange}
              />
            </Grid>
            <Grid item md={12} xs={12}>
              <CKEditor
                editor={ClassicEditor}
                data={news != null && news.id ? news?.content : 'Nhập nội dung'}
                onReady={(editor) => {
                  // You can store the "editor" and use when it is needed.
                  console.log('Editor is ready to use!')
                }}
                onChange={(event, editor) => {
                  const data = editor.getData()
                  setNews({ ...news, content: data })
                }}
              />
            </Grid>
            <Grid item md={6} xs={12}>
              <Card className={classes.root}>
                <CardMedia
                  className={classes.media}
                  style={{}}
                  image={
                    news != null && news.id
                      ? news.thumbnail
                      : 'https://cdn.pixabay.com/photo/2018/10/23/08/18/sexy-girl-3767276__340.jpg'
                  }
                  //   title={news.title}
                />
              </Card>
            </Grid>
            <Grid item md={6} xs={12}>
              <DropzoneArea
                onChange={(files) => uploadFile(files)}
                filesLimit={1}
                acceptedFiles={['image/*']}
                dropzoneText={news != null && news.id ? 'Sửa hình ảnh' : 'Thêm hình ảnh'}
              />
            </Grid>
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

NewsDialog.propTypes = {
  item: PropTypes.object.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func,
}
export default NewsDialog
